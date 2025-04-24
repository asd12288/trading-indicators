"use client";

import type { Notification } from "@/lib/types";
import { createClient } from "@supabase/supabase-js";
import useSWR from "swr";
import { useEffect, useRef } from "react";
import usePreferences from "@/hooks/usePreferences";

import SoundService from "@/lib/services/soundService";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";

// Top-level: track processed notification IDs across all hook instances
const processedNotificationIds = new Set<string>();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function useNotification(
  userId?: string,
  options?: { disableToast?: boolean },
) {
  // track processed notification IDs to avoid duplicates
  const processedIdsRef = useRef<Set<string>>(new Set());
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
          // dedupe by notification ID
          if (processedNotificationIds.has(row.id)) return;
          processedNotificationIds.add(row.id);

          // get latest preferences
          const prefs = preferencesRef.current;

          // Debug: log incoming notification and user prefs
          if (row.type === "signal") {
            const inst = row.url?.split("/").pop() || "";
            console.log(
              `[useNotification] Incoming signal for ${inst}, prefs:`,
              prefs[inst],
            );
          } else {
            console.log(
              `[useNotification] Incoming non-signal notification:`,
              row.title,
            );
          }

          // prepend to notification list
          mutate(
            (prev) =>
              prev ? [row as Notification, ...prev] : [row as Notification],
            false,
          );

          // handle toast and sound
          const isSignal = row.type === "signal";
          // extract instrument name from URL
          const inst = isSignal && row.url ? row.url.split("/").pop() : null;
          const userPref = inst ? preferencesRef.current[inst] : null;
          // for signals, skip only if notifications explicitly off
          if (isSignal && userPref?.notifications === false) {
            console.log(
              `[useNotification] signal ${inst} notifications disabled, skipping`,
            );
            return;
          }
          // show toast
          toast.success(row.title, {
            action: {
              label: "View",
              onClick: () => row.url && router.push(row.url),
            },
          });
          // play sound: always execute to verify functionality
          if (isSignal) {
            const inst = row.url?.split("/").pop() || "";
            // play completed or new sound with instrument
            if (row.title.toLowerCase().includes("closed")) {
              console.log(
                `[useNotification] playing completed sound for ${inst}`,
              );
              SoundService.playCompletedSignal(inst);
            } else {
              console.log(
                `[useNotification] playing new signal sound for ${inst}`,
              );
              SoundService.playNewSignal(inst);
            }
          } else {
            console.log("[useNotification] playing alert sound");
            SoundService.playAlert();
          }
        },
      )
      .subscribe();
    // proper cleanup
    return () => supabase.removeChannel(channel);
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
    error: error ? (error as any).message : null,
    loading,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotificationOptimistic, // << new
  };
}
