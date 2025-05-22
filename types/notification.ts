export interface Notification {
  id: string;
  url?: string;
  type: "news" | "system" | "alert" | "signal";
  created_at: string;
  is_read: boolean;
  user_id: string;
  body?: string;
  title: string;
}
