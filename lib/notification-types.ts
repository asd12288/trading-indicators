export type NotificationType = "signal" | "alert" | "system" | "account";
export type NotificationPriority = "low" | "medium" | "high" | "critical";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority?: NotificationPriority;
  link?: string;
  data?: Record<string, any>;
  groupId?: string; // For grouping related notifications
}

// Helper functions for notifications
export function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "signal":
      return "LineChart";
    case "alert":
      return "Bell";
    case "system":
      return "ServerCog";
    case "account":
      return "User";
    default:
      return "Bell";
  }
}

export function getNotificationColor(type: NotificationType) {
  switch (type) {
    case "signal":
      return "text-blue-500";
    case "alert":
      return "text-red-500";
    case "system":
      return "text-purple-500";
    case "account":
      return "text-green-500";
    default:
      return "text-slate-500";
  }
}
