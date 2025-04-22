"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/database/supabase/client";
import { Notification, NotificationCount } from "@/types/notifications";
import { toast } from "./use-toast";
import { playNotificationSound } from "@/utils/notificationSounds";

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [counts, setCounts] = useState<NotificationCount>({ unread: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClient();

  // Debug logging for hook initialization
  useEffect(() => {
    console.log(`useNotifications hook initialized for user: ${userId}`);
  }, [userId]);

  // Fetch all notifications for the current user
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    
    console.log(`Fetching notifications for user: ${userId}`);
    setLoading(true);
    try {
      // Fetch notifications ordered by unread first, then by created_at
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("is_read", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      console.log(`Fetched ${data?.length || 0} notifications`);
      setNotifications(data || []);
      
      // Calculate counts
      const unreadCount = data ? data.filter(n => !n.is_read).length : 0;
      console.log(`Notification counts - unread: ${unreadCount}, total: ${data?.length || 0}`);
      
      setCounts({
        unread: unreadCount,
        total: data ? data.length : 0
      });
    } catch (err: any) {
      setError(err);
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, supabase]);

  // Mark a notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .eq("user_id", userId);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      
      // Update counts
      setCounts(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1)
      }));
    } catch (err: any) {
      console.error("Error marking notification as read:", err);
    }
  }, [userId, supabase]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      
      // Update counts
      setCounts(prev => ({
        ...prev,
        unread: 0
      }));
      
      toast({
        title: "All notifications marked as read",
        description: "You've cleared all your unread notifications"
      });
    } catch (err: any) {
      console.error("Error marking all notifications as read:", err);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive"
      });
    }
  }, [userId, supabase]);

  // Process a real-time notification payload
  const handleRealtimeNotification = useCallback((payload: any) => {
    if (!payload) return;
    
    console.log('Real-time notification event received:', payload.eventType, payload.new?.id);
    console.log('Notification payload details:', JSON.stringify(payload));
    
    if (payload.eventType === 'INSERT') {
      // New notification - add to the top of the list
      const newNotification = payload.new as Notification;
      
      console.log('Adding new notification to state:', newNotification.title);
      
      // Update notifications list - Add to the beginning to show at the top
      setNotifications(prev => [newNotification, ...prev]);
      
      // Update counts
      setCounts(prev => {
        const newCounts = {
          unread: prev.unread + (newNotification.is_read ? 0 : 1),
          total: prev.total + 1
        };
        console.log('Updated notification counts:', newCounts);
        return newCounts;
      });
      
      // Use the centralized sound utility
      if (!newNotification.is_read) {
        playNotificationSound();
      }
    } 
    else if (payload.eventType === 'UPDATE') {
      // Updated notification - update in the list
      const updatedNotification = payload.new as Notification;
      
      console.log('Updating notification in state:', updatedNotification.id);
      
      setNotifications(prev => 
        prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
      );
      
      // If read status changed, update the unread count
      if (payload.old && payload.old.is_read !== updatedNotification.is_read) {
        setCounts(prev => ({
          ...prev,
          unread: prev.unread + (updatedNotification.is_read ? -1 : 1)
        }));
      }
    }
    else if (payload.eventType === 'DELETE') {
      // Deleted notification - remove from the list
      const deletedNotification = payload.old as Notification;
      
      console.log('Removing notification from state:', deletedNotification.id);
      
      setNotifications(prev => 
        prev.filter(n => n.id !== deletedNotification.id)
      );
      
      // Update counts
      setCounts(prev => ({
        unread: prev.unread - (deletedNotification.is_read ? 0 : 1),
        total: prev.total - 1
      }));
    }
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;
    
    fetchNotifications();
    
    // Subscribe to changes in the notifications table for this user
    console.log(`Setting up real-time subscription for notifications (user: ${userId})`);
    
    const subscription = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        handleRealtimeNotification
      )
      .subscribe();
    
    console.log('Supabase channel subscription created');
    
    return () => {
      console.log('Cleaning up notifications subscription');
      subscription.unsubscribe();
    };
  }, [userId, fetchNotifications, handleRealtimeNotification, supabase]);

  return {
    notifications,
    counts,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications
  };
}