"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Signal, Notification } from "@/lib/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function useSignalNotification() {
  const notified = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const channel = supabase
      .channel(`signal-notifications`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "all_signals" },
        async ({ new: sig }) => {
          const signal = sig as Signal;
          // dedupe by unique signal
          if (notified.current[signal.client_trade_id]) return;
          notified.current[signal.client_trade_id] = true;

          // lookup all profiles where notifications=true for this instrument
          const { data: users, error: userErr } = await supabase
            .from('profiles')
            .select('id')
            .contains('preferences', { [signal.instrument_name]: { notifications: true } });
          if (userErr) {
            console.error('Error querying preferences:', userErr.message);
            return;
          }
          if (!users?.length) return;
          // prepare batch insert
          const records = users.map((u) => ({
            user_id: u.id,
            type: 'signal',
            title: `${signal.instrument_name} trade opened`,
            body: `${signal.trade_side} – entry ${signal.entry_price}`,
            is_read: false,
          }));
          const { error: notifErr } = await supabase
            .from('notifications')
            .insert<Notification>(records);
          if (notifErr) console.error('Batch notification error:', notifErr.message);
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);
}
