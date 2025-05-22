import type { PreferenceValues } from "./preferences";

export interface Profile {
  id: string;
  username?: string;
  email?: string;
  avatar_url?: string;
  created_at?: string;
  plan?: "pro" | "free" | "premium" | "paid" | string;
  role?: "admin" | "user" | string;
  preferences?: PreferenceValues;
  subscription_end_date?: string;
  [key: string]: any;
}
