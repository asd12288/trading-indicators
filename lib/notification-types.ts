// Notification types have been removed as requested
// This file is kept as a placeholder in case other parts of the code still reference it

export type NotificationType = never;
export type NotificationPriority = never;

export interface Notification {
  id: string;
  type: any;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  data?: Record<string, any>;
}

// Helper functions replaced with empty implementations
export function getNotificationIcon() {
  return "";
}

export function getNotificationColor() {
  return "";
}
