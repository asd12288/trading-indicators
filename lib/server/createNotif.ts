import { createClient } from "@/database/supabase/server";

export async function createNotif({
  userId,
  title,
  body,
  url,
  type,
}: {
  userId: string;
  title: string;
  body?: string;
  url?: string;
  type?: string;
}) {
  const supabase = createClient();

  const { error } = (await supabase).from("notifications").insert({
    user_id: userId,
    title,
    body,
    url,
    type,
  });

  if (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}
