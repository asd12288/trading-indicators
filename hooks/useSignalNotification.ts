"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Signal } from "@/lib/types";
import SoundService from "@/lib/services/soundService";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function useSignalNotification() {
  const notified = useRef<Record<string, number>>({});
  const DEDUPE_INTERVAL = 60000; // 60 seconds
  const router = useRouter();

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
            await supabase.from("notifications").insert(records);

            // Check if the trade is a buy/long or sell/short based on Signal types
            const isBuyOrLong = ["BUY", "LONG", "Buy", "Long"].includes(
              signal.trade_side,
            );
            const detailUrl = `/smart-alerts/${signal.instrument_name}`;

            // Format entry, take profit, and stop loss prices
            const entry = parseFloat(signal.entry_price.toString());
            const tpVal = signal.take_profit_price
              ? parseFloat(signal.take_profit_price.toString())
              : NaN;
            const slVal = signal.stop_loss_price
              ? parseFloat(signal.stop_loss_price.toString())
              : NaN;
            const tpFormatted = !isNaN(tpVal)
              ? tpVal < 1
                ? tpVal.toFixed(5)
                : tpVal.toFixed(2)
              : null;
            const slFormatted = !isNaN(slVal)
              ? slVal < 1
                ? slVal.toFixed(5)
                : slVal.toFixed(2)
              : null;

            // Construct toast description with key signal details
            const description =
              `${signal.trade_side}\nEntry: ${entry.toFixed(2)}` +
              (tpFormatted ? `\nTarget: ${tpFormatted}` : "") +
              (slFormatted ? `\nStop: ${slFormatted}` : "");

            // Use green for long/buy trades and red for short/sell trades
            if (isBuyOrLong) {
              toast.success(`${signal.instrument_name}`, {
                description,
                duration: 10000,
                action: {
                  label: "Details",
                  onClick: () => router.push(detailUrl),
                },
              });
            } else {
              toast.error(`${signal.instrument_name}`, {
                description,
                duration: 10000,
                action: {
                  label: "Details",
                  onClick: () => router.push(detailUrl),
                },
              });
            }
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
            await supabase.from("notifications").insert(records2);

            const detailUrl = `/smart-alerts/${sig.instrument_name}`;
            const isBuyOrLong = ["BUY", "LONG", "Buy", "Long"].includes(
              sig.trade_side,
            );
            const entryPrice = parseFloat(sig.entry_price.toString());
            const exitPrice = parseFloat(sig.exit_price.toString());

            // Calculate profit/loss based on trade direction
            let profitLoss = 0;
            let isProfitable = false;

            if (!isNaN(entryPrice) && !isNaN(exitPrice)) {
              if (isBuyOrLong) {
                profitLoss = exitPrice - entryPrice;
              } else {
                profitLoss = entryPrice - exitPrice;
              }
              isProfitable = profitLoss > 0;
            }

            const description = `Trade closed\nEntry: ${sig.entry_price}\nExit: ${sig.exit_price}`;

            // All closed trades use info (blue) toast, regardless of Long/Short or profit/loss
            toast.info(`${sig.instrument_name} Closed`, {
              description,
              duration: 10000,
              action: {
                label: "Details",
                onClick: () => router.push(detailUrl),
              },
            });
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

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);
}
