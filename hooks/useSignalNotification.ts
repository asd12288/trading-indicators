"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Signal, Notification } from "@/lib/types";
import SoundService from "@/lib/services/soundService";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function useSignalNotification() {
  const notified = useRef<Record<string, number>>({});
  const DEDUPE_INTERVAL = 60000; // 60 seconds

  useEffect(() => {
    // unlock audio playback via a silent initialization
    SoundService.initializeAudio();
    const channel = supabase
      .channel(`signal-notifications`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "all_signals" },
        async ({ new: sig }) => {
          const signal = sig as Signal;
          // use client_trade_id for dedupe
          const dedupeKey = signal.client_trade_id;
          const now = Date.now();
          const lastTime = notified.current[dedupeKey] || 0;
          if (now - lastTime < DEDUPE_INTERVAL) return;
          notified.current[dedupeKey] = now;

          // lookup all profiles where notifications=true for this instrument
          const { data: users, error: userErr } = await supabase
            .from("profiles")
            .select("id")
            .contains("preferences", {
              [signal.instrument_name]: { notifications: true },
            });
          if (userErr || !users?.length) return;

          // batch-insert a new 'trade opened' notification for each user
          const records = users.map((u) => ({
            user_id: u.id,
            type: "signal",
            title: `${signal.instrument_name} trade opened`,
            body: `${signal.trade_side} – entry ${signal.entry_price}`,
            is_read: false,
            url: `/smart-alerts/${signal.instrument_name}`,
          }));
          try {
            await supabase.from("notifications").insert<Notification>(records);
          } catch (err) {
            console.error("Failed to insert open notifications:", err);
          }
          // trigger server-side Telegram notifications
          try {
            await fetch("/api/notifyNewSignal", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(sig),
            });
          } catch (fetchErr) {
            console.error("Error triggering Telegram notification:", fetchErr);
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "all_signals" },
        async ({ new: sig }) => {
          // only notify when exit_price is set
          if (!sig.exit_price) return;
          // use client_trade_id for exit dedupe
          const dedupeCloseKey = `exit_${sig.client_trade_id}`;
          const now2 = Date.now();
          const lastClose = notified.current[dedupeCloseKey] || 0;
          if (now2 - lastClose < DEDUPE_INTERVAL) return;
          notified.current[dedupeCloseKey] = now2;

          // find users with notifications enabled
          const { data: users } = await supabase
            .from("profiles")
            .select("id")
            .contains("preferences", {
              [sig.instrument_name]: { notifications: true },
            });
          if (!users?.length) return;

          // batch-insert a 'trade closed' notification for each user
          const records2 = users.map((u) => ({
            user_id: u.id,
            type: "signal",
            title: `${sig.instrument_name} trade closed`,
            body: `exit ${sig.exit_price}`,
            is_read: false,
            url: `/smart-alerts/${sig.instrument_name}`,
          }));
          try {
            await supabase.from("notifications").insert<Notification>(records2);
          } catch (err) {
            console.error("Failed to insert close notifications:", err);
          }
          // trigger server-side Telegram notifications for closed signals
          try {
            await fetch("/api/notifyNewSignal", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(sig),
            });
          } catch (fetchErr) {
            console.error("Error triggering Telegram notification:", fetchErr);
          }
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);
}
