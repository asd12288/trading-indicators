import { useState, useEffect, useRef } from "react";
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

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Initialize notification sound - similar to useAlerts pattern
  useEffect(() => {
    notificationSoundRef.current = new Audio("/audio/notification.mp3");

    return () => {
      if (notificationSoundRef.current) {
        notificationSoundRef.current.pause();
        notificationSoundRef.current = null;
      }
    };
  }, []);

  // Function to fetch notifications
  const fetchNotifications = async () => {
    if (!userId) {
      console.log("No user ID available.");
      return;
    }

    setLoading(true);
    try {
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
      } else {
        // Set empty array if no notifications found
        setNotifications([]);
      }
    } catch (err) {
      console.error("Unexpected error fetching notifications:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch effect
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  // Set up subscriptions to tables that can generate notifications
  useEffect(() => {
    if (!userId) return;

    try {
      // 1. Subscription to notifications table
      const notificationsSubscription = supabaseClient
        .channel("notifications_changes")
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
              // Add new notification to state
              const newNotification = payload.new as any;

              // Transform to match interface
              const notification: Notification = {
                id: newNotification.id,
                type: newNotification.type,
                title: newNotification.title,
                message: newNotification.message,
                timestamp: newNotification.created_at,
                read: newNotification.read,
                link: newNotification.link,
                data: newNotification.additional_data,
              };

              setNotifications((prev) => [notification, ...prev]);

              // Play sound for new notification (like in useAlerts)
              if (notificationSoundRef.current) {
                notificationSoundRef.current
                  .play()
                  .catch((err) =>
                    console.error("Failed to play notification sound:", err),
                  );
              }

              // Show toast for new notification
              toast({
                title: notification.title,
                description: notification.message,
                variant:
                  notification.type === "alert" ? "destructive" : "default",
              });
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
                  link: `/signals/${signal.instrument_name}`,
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

      // 3. Generate notifications from alerts (inspired by useAlerts)
      const alertsSubscription = supabaseClient
        .channel("alerts_notification_generator")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "signals_alert",
          },
          async (payload) => {
            const alert = payload.new as any;

            // Create alert notifications automatically
            try {
              await supabaseClient.from("notifications").insert({
                user_id: userId,
                type: "alert",
                title: `Alert: ${alert.instrument}`,
                message:
                  alert.message || `Price alert triggered at ${alert.price}`,
                read: false,
                link: `/alerts`,
                additional_data: {
                  instrument: alert.instrument,
                  price: alert.price,
                  timestamp: alert.time_utc,
                },
              });
            } catch (err) {
              console.error("Failed to create alert notification:", err);
            }
          },
        )
        .subscribe();

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
        supabaseClient.removeChannel(notificationsSubscription);
        supabaseClient.removeChannel(signalsSubscription);
        supabaseClient.removeChannel(alertsSubscription);
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
