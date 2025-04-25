"use client";

import usePreferences from "@/hooks/usePreferences";
import type { Notification } from "@/lib/types";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";
import useSWR from "swr";

import { useRouter } from "@/i18n/routing";
import SoundService from "@/lib/services/soundService";
import { toast } from "sonner";

// Top-level: track processed notification IDs across all hook instances
const processedNotificationIds = new Set<string>();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// track which users we've subscribed to avoid duplicate handlers
const subscribedUserChannels = new Set<string>();

export default function useNotification(
  userId?: string,
  options?: { disableToast?: boolean },
) {
  const router = useRouter();
  const disableToast = options?.disableToast ?? false;
  // load user preferences to check volume settings
  const { preferences } = usePreferences(userId);
  // keep a ref of preferences for stable access in subscription
  const preferencesRef = useRef(preferences);
  useEffect(() => {
    preferencesRef.current = preferences;
  }, [preferences]);

  // 1. Use SWR for fetching and caching
  const fetchNotifications = async (): Promise<Notification[]> => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Notification[];
  };
  const {
    data: notification,
    error,
    isLoading: loading,
    mutate,
  } = useSWR(userId ? ["notifications", userId] : null, fetchNotifications);

  // 2. Realtime subscription: prepend new notifications
  useEffect(() => {
    if (!userId) return;
    if (subscribedUserChannels.has(userId)) return;
    subscribedUserChannels.add(userId);
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        ({ new: row }) => {
          if (processedNotificationIds.has(row.id)) return;
          processedNotificationIds.add(row.id);
          const isSignal = row.type === "signal";
          const inst = isSignal && row.url ? row.url.split("/").pop() : null;
          const userPref = inst ? preferencesRef.current[inst] : null;
          if (isSignal && userPref?.notifications === false) return;
          mutate(
            (prev) =>
              prev ? [row as Notification, ...prev] : [row as Notification],
            false,
          );
          if (!disableToast) {
            // Enhanced toast for signals with more visual indicators
            if (isSignal) {
              const isClosedSignal = row.title.toLowerCase().includes("closed");

              // Use proper trade_side detection based on Signal type from types.ts
              const tradeSide =
                row.body?.toLowerCase().includes("buy") ||
                row.body?.toLowerCase().includes("long")
                  ? "buy"
                  : row.body?.toLowerCase().includes("sell") ||
                      row.body?.toLowerCase().includes("short")
                    ? "sell"
                    : null;

              // Extract price from body if available: "BUY – entry 12345.67" or "exit 12345.67"
              const priceMatch = row.body?.match(
                /entry\s*([\d,.]+)|exit\s*([\d,.]+)/i,
              );
              const price = priceMatch ? priceMatch[1] || priceMatch[2] : null;

              // Create enhanced description with formatted data
              const formattedBody = row.body
                ?.replace(/–/g, ":\n")
                .replace("entry", "Entry: $")
                .replace("exit", "Exit: $");
              const description =
                formattedBody +
                (price && !formattedBody?.includes("$")
                  ? `\nPrice: $${price}`
                  : "") +
                "\n\nTap to view details";

              // Single toast with appropriate color based on signal type
              if (isClosedSignal) {
                // For closed signals - always blue
                toast.info(row.title, {
                  description,
                  duration: 8000,
                  action: {
                    label: "Details",
                    onClick: () => row.url && router.push(row.url),
                  },
                });
              } else if (tradeSide === "buy") {
                // For buy/long signals - green
                toast.success(row.title, {
                  description,
                  duration: 8000,
                  action: {
                    label: "Details",
                    onClick: () => row.url && router.push(row.url),
                  },
                });
              } else if (tradeSide === "sell") {
                // For sell/short signals - red
                toast.error(row.title, {
                  description,
                  duration: 8000,
                  action: {
                    label: "Details",
                    onClick: () => row.url && router.push(row.url),
                  },
                });
              } else {
                // Default for unknown signal types
                toast(row.title, {
                  description,
                  duration: 8000,
                  action: {
                    label: "Details",
                    onClick: () => row.url && router.push(row.url),
                  },
                });
              }
            } else {
              // Non-signal notifications just get a basic toast
              toast(row.title, {
                description: row.body,
              });
            }
          }
          if (isSignal) {
            if (row.title.toLowerCase().includes("closed"))
              SoundService.playCompletedSignal(inst || "");
            else SoundService.playNewSignal(inst || "");
          } else {
            SoundService.playAlert();
          }
        },
      )
      .subscribe();
    return () => {
      subscribedUserChannels.delete(userId);
      void supabase.removeChannel(channel);
    };
  }, [userId, disableToast, router, mutate]);

  // 3. Mark a single notification as read
  const markAsRead = async (notificationId: string) => {
    if (!userId) return false;

    try {
      const { error: updateError } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (updateError) throw updateError;

      // Optimistic update
      mutate(
        (prev) =>
          prev
            ? prev.map((n) =>
                n.id === notificationId ? { ...n, is_read: true } : n,
              )
            : [],
        false,
      );

      return true;
    } catch (err) {
      console.error("Error marking notification as read:", err);
      return false;
    }
  };

  // 4. Mark all notifications as read
  const markAllAsRead = async () => {
    if (!userId) return false;

    try {
      const { error: updateError } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (updateError) throw updateError;

      // Optimistic update
      mutate(
        (prev) => (prev ? prev.map((n) => ({ ...n, is_read: true })) : []),
        false,
      );

      return true;
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      return false;
    }
  };

  const addNotificationOptimistic = (n: Notification) =>
    mutate((prev) => (prev ? [n, ...prev] : [n]), false);

  // 5. Clear all notifications
  const clearNotifications = async () => {
    if (!userId) return false;

    try {
      const { error: deleteError } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      // Optimistic update
      mutate([], false);

      return true;
    } catch (err) {
      console.error("Error clearing notifications:", err);
      return false;
    }
  };

  return {
    notification: notification ?? [],
    error: error instanceof Error ? error.message : null,
    loading,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotificationOptimistic, // << new
  };
}
