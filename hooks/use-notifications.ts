"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import supabaseClient from "@/database/supabase/supabase";
import { Notification } from "@/lib/notification-types";
import { toast } from "@/hooks/use-toast";
import usePreferences from "@/hooks/usePreferences";

// Helper function to check if a file exists at a given URL
const checkFileExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (e) {
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

  // Use passed userId directly
  const userId = passedUserId;
  // Load user signal notification preferences
  const { notificationsOn } = usePreferences(userId);

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
            soundEnabledRef.current = false;
            return;
          }

          // Create audio element
          const audio = new Audio();

          // Add comprehensive error handling
          audio.addEventListener("error", () => {
            // Mark sound as unavailable
            soundEnabledRef.current = false;
            notificationSoundRef.current = null;
          });

          // Set up successful load handler
          audio.addEventListener("canplaythrough", () => {
            soundEnabledRef.current = true;
          });

          // Set preload mode and source
          audio.preload = "auto";
          audio.src = audioFormats[0].path;

          // Store the audio element
          notificationSoundRef.current = audio;
        });
      } else {
        soundEnabledRef.current = false;
      }
    } catch (err) {
      notificationSoundRef.current = null;
      soundEnabledRef.current = false;
    }

    return () => {
      if (notificationSoundRef.current) {
        try {
          notificationSoundRef.current.pause();
          notificationSoundRef.current = null;
        } catch (err) {
          // Silent catch
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
        playPromise.catch(() => {
          // Don't disable sound entirely - it might be an autoplay restriction
        });
      }
    } catch (err) {
      soundEnabledRef.current = false;
    }
  }, []);

  // Make fetchNotifications a callback to ensure stable reference
  const fetchNotifications = useCallback(
    async (silent = false) => {
      if (!userId) {
        return;
      }

      if (!silent) setLoading(true);
      try {
        const { data, error } = await supabaseClient
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(20);

        if (error) {
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
        } else {
          // Set empty array if no notifications found
          setNotifications([]);
        }
      } catch (err) {
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

  // Enhanced real-time subscription
  useEffect(() => {
    if (!userId) return;

    try {
      // Create a unique channel name to avoid conflicts
      const channelName = `notifications-${userId}-${Date.now()}`;

      // 1. Subscription to notifications table
      const notificationsSubscription = supabaseClient
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const newNotification = payload.new as any; // raw DB row

              // Transform to match interface
              const notification: Notification = {
                id: newNotification.id,
                type: newNotification.type,
                title: newNotification.title,
                message: newNotification.message,
                timestamp: newNotification.created_at,
                read: newNotification.read || false, // Ensure read status is properly set
                link: newNotification.link,
                data: newNotification.additional_data,
              };

              // Play sound
              playSound();

              // Add to notifications array
              setNotifications((prev) => [notification, ...prev]);
            } else if (payload.eventType === "UPDATE") {
              // Update existing notification
              setNotifications((prev) =>
                prev.map((n) =>
                  n.id === payload.new.id
                    ? {
                        ...n,
                        title: payload.new.title,
                        message: payload.new.message,
                        read: payload.new.read,
                        link: payload.new.link,
                        data: payload.new.additional_data,
                      }
                    : n,
                ),
              );
            } else if (payload.eventType === "DELETE") {
              // Remove deleted notification
              setNotifications((prev) =>
                prev.filter((n) => n.id !== payload.old.id),
              );
            }
          },
        )
        .subscribe();

      // 2. Subscription to signals table for high importance signals
      const signalsSubscription = supabaseClient
        .channel(`signals-${userId}-${Date.now()}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "signals",
          },
          async (payload) => {
            // This pattern is similar to what's in useSignals
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const signal = payload.new as any;

            if (signal && signal.importance === "high") {
              try {
                // Create a notification in the notifications table
                await supabaseClient.from("notifications").insert({
                  user_id: userId,
                  type: "signal",
                  title: `New Signal: ${signal.instrument_name}`,
                  message: `${signal.signal_type} signal detected at ${signal.price}`,
                  read: false,
                  link: `/smart-alerts/${signal.instrument_name}`,
                  additional_data: {
                    instrument: signal.instrument_name,
                    price: signal.price,
                    signal_type: signal.signal_type,
                    timestamp: signal.entry_time,
                  },
                });
              } catch (err) {
                // Silent catch
              }
            }
          },
        )
        .subscribe();

      // 3. Subscription to instruments_status table for trend changes
      const statusSubscription = supabaseClient
        .channel(`status-${userId}-${Date.now()}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "instruments_status",
          },
          async (payload) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const status = payload.new as any;

            // Check if this is a significant trend change
            if (
              status.trend &&
              (status.trend === "strongly_bullish" ||
                status.trend === "strongly_bearish")
            ) {
              try {
                await supabaseClient.from("notifications").insert({
                  user_id: userId,
                  type: "system",
                  title: `Trend Change: ${status.instrument_name}`,
                  message: `${status.instrument_name} trend has changed to ${status.trend.replace("_", " ")}`,
                  read: false,
                  additional_data: {
                    instrument: status.instrument_name,
                    trend: status.trend,
                    timestamp: status.timestamp,
                  },
                });
              } catch (err) {
                // Silent catch
              }
            }
          },
        )
        .subscribe();

      // 4. Subscription to signal stop/target changes for user preferences
      const priceChangeSubscription = supabaseClient
        .channel(`signals-update-${userId}-${Date.now()}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "signals" },
          async (payload) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const oldSignal = payload.old as any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newSignal = payload.new as any;
            // Only notify on stop/target changes
            if (
              oldSignal.stop_loss_price !== newSignal.stop_loss_price ||
              oldSignal.take_profit_price !== newSignal.take_profit_price
            ) {
              // Check if user wants notifications for this instrument
              if (notificationsOn.includes(newSignal.instrument_name)) {
                try {
                  await supabaseClient.from("notifications").insert({
                    user_id: userId,
                    type: "signal",
                    title: `Update on ${newSignal.instrument_name}`,
                    message: `Stop: ${newSignal.stop_loss_price}, Target: ${newSignal.take_profit_price}`,
                    read: false,
                    link: `/smart-alerts/${newSignal.instrument_name}`,
                    additional_data: {
                      old_stop_loss: oldSignal.stop_loss_price,
                      new_stop_loss: newSignal.stop_loss_price,
                      old_take_profit: oldSignal.take_profit_price,
                      new_take_profit: newSignal.take_profit_price,
                      instrument: newSignal.instrument_name,
                    },
                  });
                } catch {
                  // silent catch
                }
              }
            }
          },
        )
        .subscribe();

      return () => {
        supabaseClient.removeChannel(notificationsSubscription);
        supabaseClient.removeChannel(signalsSubscription);
        supabaseClient.removeChannel(statusSubscription);
        supabaseClient.removeChannel(priceChangeSubscription);
      };
    } catch {
      // silent catch
    }
  }, [userId, playSound, notificationsOn]);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Update local state optimistically
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

      // Update in database
      try {
        const { error } = await supabaseClient
          .from("notifications")
          .update({ read: true })
          .eq("user_id", userId)
          .eq("read", false);

        if (error) {
          // Revert on error by refetching
          fetchNotifications();
        }
      } catch (err) {
        // Revert on error by refetching
        fetchNotifications();
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

      // Update in database
      try {
        const { error } = await supabaseClient
          .from("notifications")
          .update({ read: true })
          .eq("id", id);

        if (error) {
          // Revert on error by refetching
          fetchNotifications();
        }
      } catch (err) {
        // Revert on error by refetching
        fetchNotifications();
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
          toast({
            title: "Error",
            description: "Some notifications couldn't be deleted",
            variant: "destructive",
          });

          // Revert on failure by refetching
          fetchNotifications();
        }
      } catch (err) {
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
          // Refetch on error to restore state
          fetchNotifications();
        }
      } catch (err) {
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
