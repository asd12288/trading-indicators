export type NotificationType = 'system' | 'alert' | 'account' | 'trade' | 'info';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string | null;
  is_read: boolean;
  created_at: string;
  expires_at?: string | null;
  additional_data?: Record<string, any> | null;
}

export interface NotificationCount {
  unread: number;
  total: number;
}