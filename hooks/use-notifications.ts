"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import supabaseClient from "@/database/supabase/supabase";
import { Notification } from "@/lib/notification-types";
import { toast } from "@/hooks/use-toast";
import { BellOff } from "lucide-react";

export function useNotifications(passedUserId?: string) {
  // Initialize with empty array instead of sample notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);

  // Use passed userId directly instead of depending on the useUser hook
  const userId = passedUserId;

  // Calculate unread count - make sure this is accurate
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Initialize notification sound with better error handling
  useEffect(() => {
    // Create audio element with explicit error handling
    try {
      // Check if Audio API is available
      if (typeof Audio !== "undefined") {
        notificationSoundRef.current = new Audio("/audio/notification.mp3");

        // Add proper error handling
        notificationSoundRef.current.addEventListener("error", (e) => {
          console.error(
            "Error loading notification sound:",
            e.target.error?.message || "Unknown audio error",
          );
          notificationSoundRef.current = null;
        });

        // Preload the audio file
        notificationSoundRef.current.preload = "auto";
        notificationSoundRef.current.load();
      } else {
        console.log("Audio API not available in this browser");
      }
    } catch (err) {
      console.error("Failed to initialize notification sound:", err);
      notificationSoundRef.current = null;
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
      // Create a unique channel name to avoid conflicts
      const channelName = `notifications-${userId}-${Date.now()}`;
      console.log(`[useNotifications] Setting up channel: ${channelName}`);

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
            console.log(
              `[useNotifications] Received real-time event:`,
              payload.eventType,
            );

            if (payload.eventType === "INSERT") {
              // Add new notification to state
              const newNotification = payload.new as any;

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

              console.log(
                `[useNotifications] Adding new notification:`,
                notification,
              );

              // Play sound with better error handling
              if (notificationSoundRef.current) {
                try {
                  // Reset the position
                  notificationSoundRef.current.currentTime = 0;

                  // Use a silent catch for the play promise to avoid console errors
                  const playPromise = notificationSoundRef.current.play();
                  if (playPromise !== undefined) {
                    playPromise.catch((err) => {
                      // Most browsers require user interaction before playing audio
                      console.log(
                        "Audio play prevented (user interaction may be needed)",
                      );
                    });
                  }
                } catch (err) {
                  console.warn(
                    "Could not play notification sound - silent fail",
                  );
                }
              }
            } else if (payload.eventType === "UPDATE") {
              // Update existing notification
              console.log(
                `[useNotifications] Updating notification:`,
                payload.new.id,
              );

              setNotifications((prev) =>
                prev.map((n) =>
                  n.id === payload.new.id
                    ? {
                        ...n,
                        title: payload.new.title,
                        message: payload.new.message,
                        read: payload.new.read,
                      }
                    : n,
                ),
              );
            } else if (payload.eventType === "DELETE") {
              // Remove deleted notification
              console.log(
                `[useNotifications] Removing notification:`,
                payload.old.id,
              );

              setNotifications((prev) =>
                prev.filter((n) => n.id !== payload.old.id),
              );
            }
          },
        )
        .subscribe((status) => {
          console.log(`[useNotifications] Subscription status:`, status);
        });

      // 2. Generate notifications from signals
      // Similar pattern to useSignals but creating notifications instead
      const signalsSubscription = supabaseClient
        .channel("signals_notification_generator")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "all_signals",
          },
          async (payload) => {
            // Generate a notification for important signals
            // This pattern is similar to what's in useSignals
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
                console.error("Failed to create signal notification:", err);
              }
            }
          },
        )
        .subscribe();

      // Remove the alerts notification generator since it's already handled by a component

      // 4. Generate notifications from instrument status changes (inspired by useInstrumentStatus)
      const statusSubscription = supabaseClient
        .channel("status_notification_generator")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "instruments_status",
          },
          async (payload) => {
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
                console.error("Failed to create status notification:", err);
              }
            }
          },
        )
        .subscribe();

      return () => {
        console.log(`[useNotifications] Cleaning up channel: ${channelName}`);
        supabaseClient.removeChannel(notificationsSubscription);
        supabaseClient.removeChannel(signalsSubscription);
        // Remove reference to the alertsSubscription that no longer exists
        supabaseClient.removeChannel(statusSubscription);
      };
    } catch (err) {
      console.error("Error setting up notification subscriptions:", err);
    }
  }, [userId]);

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
  };
}
