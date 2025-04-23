"use client";

import type { Notification } from "@/lib/types";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function useNotification(userId?: string) {
  const [notification, setNotification] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Initial fetch (SSR friendly)

  useEffect(() => {
    if (!userId) {
      // No user: stop loading
      setNotification([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      }

      setNotification(data as Notification[]);
      setLoading(false);
    })();
  }, [userId]);

  // 2. Realtime
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const row = payload.new as Notification;
          setNotification((prev) => {
            switch (payload.eventType) {
              case "INSERT":
                return [row, ...prev];
              case "UPDATE":
                return prev.map((n) => (n.id === row.id ? { ...n, ...row } : n));
              case "DELETE":
                return prev.filter((n) => n.id !== row.id);
              default:
                return prev;
            }
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // 3. Mark a single notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error: updateError } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);
      
      if (updateError) throw updateError;
      
      // Optimistic update
      setNotification((prev) => 
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
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
      setNotification((prev) => 
        prev.map((n) => ({ ...n, is_read: true }))
      );
      
      return true;
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      return false;
    }
  };

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
      setNotification([]);
      
      return true;
    } catch (err) {
      console.error("Error clearing notifications:", err);
      return false;
    }
  };

  return {
    notification,
    error,
    loading,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };
}
