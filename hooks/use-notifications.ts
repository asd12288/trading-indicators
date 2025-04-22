"use client";

// This hook has been disabled as requested to remove all notification functionality
export function useNotifications() {
  // Return empty notification state to prevent runtime errors
  return {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    markAllAsRead: async () => {},
    markAsRead: async () => {},
    deleteNotification: async () => {},
    bulkDelete: async () => {},
    refetch: async () => {},
    soundEnabled: false,
    toggleSound: () => false,
  };
}
