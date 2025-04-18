"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import supabaseClient from "@/database/supabase/supabase";
import { Notification } from "@/lib/notification-types";
import { toast } from "@/hooks/use-toast";
import { BellOff } from "lucide-react";

// Helper function to check if a file exists at a given URL
const checkFileExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (e) {
    console.warn(`Failed to check if file exists at ${url}:`, e);
    return false;
  }
};

export function useNotifications(passedUserId?: string) {
  // Initialize with empty array instead of sample notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);
  const soundEnabledRef = useRef<boolean>(true); // Track if sound is enabled

  // Use passed userId directly instead of depending on the useUser hook
  const userId = passedUserId;

  // Calculate unread count - make sure this is accurate
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Initialize notification sound with better error handling and format fallbacks
  useEffect(() => {
    // Check if window is available (for SSR)
    if (typeof window === "undefined") return;

    // Audio formats to try in order of preference
    const audioFormats = [
      { path: "/audio/notification.mp3", type: "audio/mpeg" },
      { path: "/audio/notification.ogg", type: "audio/ogg" },
      { path: "/audio/notification.wav", type: "audio/wav" },
    ];

    // Try to create an audio element
    try {
      if (typeof Audio !== "undefined") {
        // First check if the primary audio file exists
        checkFileExists(audioFormats[0].path).then((exists) => {
          if (!exists) {
            console.warn(
              `Audio file ${audioFormats[0].path} not found, will try fallbacks`,
            );
            soundEnabledRef.current = false;
            return;
          }

          // Create audio element
          const audio = new Audio();

          // Add comprehensive error handling
          audio.addEventListener("error", (e) => {
            const errorMessage =
              e.target?.error?.message || "Unknown audio error";
            console.error(
              `Error loading notification sound: "${errorMessage}"`,
            );

            // If there was a format error, try the next format
            if (
              e.target?.error?.code ===
                MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED ||
              e.target?.error?.code === MediaError.MEDIA_ERR_FORMAT
            ) {
              console.log(
                "Format not supported, will try fallbacks on next notification",
              );
            }

            // Mark sound as unavailable
            soundEnabledRef.current = false;
            notificationSoundRef.current = null;
          });

          // Set up successful load handler
          audio.addEventListener("canplaythrough", () => {
            console.log("Notification sound loaded successfully");
            soundEnabledRef.current = true;
          });

          // Set preload mode and source
          audio.preload = "auto";
          audio.src = audioFormats[0].path;

          // Store the audio element
          notificationSoundRef.current = audio;
        });
      } else {
        console.log("Audio API not available in this browser");
        soundEnabledRef.current = false;
      }
    } catch (err) {
      console.error("Failed to initialize notification sound:", err);
      notificationSoundRef.current = null;
      soundEnabledRef.current = false;
    }

    return () => {
      if (notificationSoundRef.current) {
        try {
          notificationSoundRef.current.pause();
          notificationSoundRef.current = null;
        } catch (err) {
          console.warn("Error cleaning up audio:", err);
        }
      }
    };
  }, []);

  // Improved playSound function with fallbacks
  const playSound = useCallback(() => {
    // Don't attempt to play if sound is disabled
    if (!soundEnabledRef.current || !notificationSoundRef.current) return;

    try {
      // Reset the position
      notificationSoundRef.current.currentTime = 0;

      // Use a silent catch for the play promise to avoid console errors
      const playPromise = notificationSoundRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Audio play prevented (user interaction may be needed)");
          // Don't disable sound entirely - it might be an autoplay restriction
        });
      }
    } catch (err) {
      console.warn("Could not play notification sound:", err);
      soundEnabledRef.current = false;
    }
  }, []);

  // Make fetchNotifications a callback to ensure stable reference
  const fetchNotifications = useCallback(
    async (silent = false) => {
      if (!userId) {
        console.log("No user ID available.");
        return;
      }

      if (!silent) setLoading(true);
      try {
        console.log(
          `[useNotifications] Fetching notifications for user ${userId}`,
        );
        const { data, error } = await supabaseClient
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(20);

        if (error) {
          console.warn("Error fetching notifications:", error);
          setError("Failed to load notifications");
          return;
        }

        if (data && data.length > 0) {
          // Transform data to match Notification interface
          const transformedData: Notification[] = data.map((item) => ({
            id: item.id,
            type: item.type as "alert" | "signal" | "account" | "system",
            title: item.title,
            message: item.message,
            timestamp: item.created_at,
            read: item.read,
            link: item.link || undefined,
            data: item.additional_data || undefined,
          }));

          setNotifications(transformedData);
          // Log the count of unread notifications for debugging
          const unreadCount = transformedData.filter((n) => !n.read).length;
          console.log(
            `[useNotifications] Found ${transformedData.length} notifications, ${unreadCount} unread`,
          );
        } else {
          // Set empty array if no notifications found
          setNotifications([]);
        }
      } catch (err) {
        console.error("Unexpected error fetching notifications:", err);
        if (!silent) setError("An unexpected error occurred");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [userId],
  );

  // Initial fetch effect
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId, fetchNotifications]);

  // Enhanced real-time subscription with better error handling
  useEffect(() => {
    if (!userId) return;

    try {
      // Create unique channel names for each subscription type
      const notificationChannel = `notifications-${userId}-${Date.now()}`;
      const signalsChannel = `signals-${userId}-${Date.now()}`;
      const statusChannel = `status-${userId}-${Date.now()}`;

      console.log(`[useNotifications] Setting up channels`);

      // 1. Main notifications subscription
      const notificationsSubscription = supabaseClient
        .channel(notificationChannel)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          async (payload) => {
            console.log(
              `[useNotifications] Received notification event:`,
              payload.eventType,
              payload
            );

            if (payload.eventType === "INSERT") {
              const newNotification = payload.new as any;
              
              // Transform to match interface
              const notification: Notification = {
                id: newNotification.id,
                type: newNotification.type,
                title: newNotification.title,
                message: newNotification.message,
                timestamp: newNotification.created_at,
                read: newNotification.read || false,
                link: newNotification.link,
                data: newNotification.additional_data,
              };

              setNotifications((prev) => [notification, ...prev]);
              
              // Play sound for new notifications
              if (soundEnabledRef.current) {
                playSound();
              }
            } else if (payload.eventType === "UPDATE") {
              setNotifications((prev) =>
                prev.map((n) =>
                  n.id === payload.new.id
                    ? {
                        ...n,
                        title: payload.new.title,
                        message: payload.new.message,
                        read: payload.new.read,
                      }
                    : n
                )
              );
            } else if (payload.eventType === "DELETE") {
              setNotifications((prev) =>
                prev.filter((n) => n.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();

      // 2. Signal notifications subscription
      const signalsSubscription = supabaseClient
        .channel(signalsChannel)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "all_signals",
          },
          async (payload) => {
            const signal = payload.new as any;
            
            if (signal?.importance === "high") {
              await supabaseClient.from("notifications").insert({
                user_id: userId,
                type: "signal",
                title: `New Signal: ${signal.instrument_name}`,
                message: `${signal.signal_type} signal detected at ${signal.price}`,
                read: false,
                link: `/signals/${signal.instrument_name}`,
                additional_data: {
                  instrument: signal.instrument_name,
                  price: signal.price,
                  signal_type: signal.signal_type,
                  timestamp: signal.entry_time,
                },
              });
            }
          }
        )
        .subscribe();

      // 3. Status notifications subscription
      const statusSubscription = supabaseClient
        .channel(statusChannel)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "instruments_status",
          },
          async (payload) => {
            const status = payload.new as any;
            
            if (status?.trend && 
                (status.trend === "strongly_bullish" || 
                 status.trend === "strongly_bearish")) {
              await supabaseClient.from("notifications").insert({
                user_id: userId,
                type: "system",
                title: `Trend Change: ${status.instrument_name}`,
                message: `${status.instrument_name} trend has changed to ${status.trend.replace(
                  "_",
                  " "
                )}`,
                read: false,
                additional_data: {
                  instrument: status.instrument_name,
                  trend: status.trend,
                  timestamp: status.timestamp,
                },
              });
            }
          }
        )
        .subscribe();

      // Cleanup subscriptions
      return () => {
        console.log("[useNotifications] Cleaning up subscriptions");
        supabaseClient.removeChannel(notificationsSubscription);
        supabaseClient.removeChannel(signalsSubscription);
        supabaseClient.removeChannel(statusSubscription);
      };
    } catch (err) {
      console.error("[useNotifications] Subscription error:", err);
    }
  }, [userId, playSound]);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Update local state optimistically
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

      // Update in database if table exists
      try {
        const { error } = await supabaseClient
          .from("notifications")
          .update({ read: true })
          .eq("user_id", userId)
          .eq("read", false);

        if (error) {
          console.warn("Error updating notifications:", error);
        }
      } catch (err) {
        console.warn("Error marking notifications as read:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Mark a single notification as read
  const markAsRead = async (id: string) => {
    if (!userId) return;

    setLoading(true);
    try {
      // Update local state optimistically
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );

      // Update in database if table exists
      try {
        const { error } = await supabaseClient
          .from("notifications")
          .update({ read: true })
          .eq("id", id);

        if (error) {
          console.warn("Error updating notification:", error);
        }
      } catch (err) {
        console.warn("Error marking notification as read:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Bulk delete notifications
  const bulkDelete = async (notificationIds: string[]) => {
    if (!userId || notificationIds.length === 0) return;

    setLoading(true);
    try {
      // Update local state optimistically
      setNotifications((prev) =>
        prev.filter((n) => !notificationIds.includes(n.id)),
      );

      // Delete from database
      try {
        const { error } = await supabaseClient
          .from("notifications")
          .delete()
          .in("id", notificationIds);

        if (error) {
          console.warn("Error deleting notifications:", error);
          toast({
            title: "Error",
            description: "Some notifications couldn't be deleted",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.warn("Error deleting notifications:", err);
        // Revert on failure by refetching
        fetchNotifications();
      }
    } finally {
      setLoading(false);
    }
  };

  // Add a delete notification function
  const deleteNotification = async (id: string) => {
    if (!userId) return;

    setLoading(true);
    try {
      // Update local state optimistically
      setNotifications((prev) => prev.filter((n) => n.id !== id));

      // Delete from database
      try {
        const { error } = await supabaseClient
          .from("notifications")
          .delete()
          .eq("id", id);

        if (error) {
          console.warn("Error deleting notification:", error);
          // Refetch on error to restore state
          fetchNotifications();
        }
      } catch (err) {
        console.warn("Error deleting notification:", err);
        // Refetch on error to restore state
        fetchNotifications();
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAllAsRead,
    markAsRead,
    deleteNotification,
    bulkDelete,
    refetch: fetchNotifications,
    soundEnabled: soundEnabledRef.current,
    // Add ability to toggle sound
    toggleSound: () => {
      soundEnabledRef.current = !soundEnabledRef.current;
      return soundEnabledRef.current;
    },
  };
}
