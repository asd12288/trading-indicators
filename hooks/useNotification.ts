"use client";

import type { Notification } from "@/lib/types";
import { createClient } from "@supabase/supabase-js";
import useSWR from 'swr';
import { useEffect } from 'react';
import { toast } from "sonner";
import SoundService from "@/lib/services/soundService";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function useNotification(userId?: string) {
  // 1. Use SWR for fetching and caching
  const fetchNotifications = async (): Promise<Notification[]> => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Notification[];
  };
  const { data: notification, error, isLoading: loading, mutate } = useSWR(
    userId ? ['notifications', userId] : null,
    fetchNotifications
  );

  // 2. Realtime subscription: prepend new notifications
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        ({ new: row }) => {
          mutate((prev) => prev ? [row as Notification, ...prev] : [row as Notification], false);
          toast.success(row.title);
          SoundService.playNewSignal();
        }
      )
      .subscribe();
    return () => channel.unsubscribe();
  }, [userId, mutate]);

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
      mutate((prev) =>
        prev ? prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n,
        ) : [],
        false
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
      mutate((prev) =>
        prev ? prev.map((n) => ({ ...n, is_read: true })) : [],
        false
      );

      return true;
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      return false;
    }
  };

  const addNotificationOptimistic = (n: Notification) =>
    mutate((prev) => prev ? [n, ...prev] : [n], false);

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
