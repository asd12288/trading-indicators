"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import supabaseClient from "@/database/supabase/client";
import { useUser } from "@/providers/UserProvider";
import type { Notification } from "@/lib/types";

interface NotificationContextType {
  notifications: Notification[];
  error: string | null;
  loading: boolean;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  clearNotifications: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  error: null,
  loading: false,
  markAsRead: async () => false,
  markAllAsRead: async () => false,
  clearNotifications: async () => false,
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch initial notifications
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const { data, error } = await supabaseClient
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (error) setError(error.message);
        else if (data) setNotifications(data as Notification[]);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // setup realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabaseClient
      .channel(`notifications-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        ({ new: row }) => {
          const notif = row as Notification;
          setNotifications((prev) => [notif, ...prev]);
          // optional toast and sound logic here
        },
      )
      .subscribe();
    return () => {
      void supabaseClient.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (id: string) => {
    if (!user) return false;
    const { error } = await supabaseClient.from("notifications").update({ is_read: true }).eq("id", id);
    if (error) {
      setError(error.message);
      return false;
    }
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    return true;
  };

  const markAllAsRead = async () => {
    if (!user) return false;
    const { error } = await supabaseClient
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    if (error) {
      setError(error.message);
      return false;
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    return true;
  };

  const clearNotifications = async () => {
    if (!user) return false;
    const { error } = await supabaseClient.from("notifications").delete().eq("user_id", user.id);
    if (error) {
      setError(error.message);
      return false;
    }
    setNotifications([]);
    return true;
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, error, loading, markAsRead, markAllAsRead, clearNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
};