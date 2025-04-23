



import { createClient } from "@/database/supabase/client";
import { useCallback, useEffect, useState } from "react";

export function useNotif(userId: string) {
  const supabase = createClient();

  const [items, setItems] = useState();
  const [unread, setUnread] = useState<number>(0);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      setItems(data || []);
      setUnread((data || []).filter((n) => !n.is_read).length);
    })();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`notif:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setItems((prev) => [payload.new as DBNotifcation, ...prev]);
          setUnread((prev) => prev + 1);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const markAsRead = useCallback(async (id: string) => {
    setItems((cur) =>
      cur.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    setUnread((cur) => Math.max(0, cur - 1));
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  }, []);

  return { items, unread, markAsRead };
}
