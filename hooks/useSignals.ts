"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import { createClient } from "@supabase/supabase-js";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Signal } from "@/lib/types";
import { toast } from "sonner";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Mode = "all" | "latest";

export default function useSignals(mode: Mode = "latest") {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // 1. Initial fetch (SSR-friendly)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from(mode === "latest" ? "latest_signals_per_instrument" : "all_signals")
        .select("*")
        .order("entry_time", { ascending: false });

      if (cancelled) return;
      if (error) return setError(error.message);
      setSignals(data as Signal[]);
    })();

    return () => {
      cancelled = true;
    };
  }, [mode]);

  // 2. Realtime updates
  useEffect(() => {
    // tear down old channel if React re-renders/strict-mode doubles
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`signals-${mode}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "all_signals" },
        (payload) => {
          const { eventType, new: newRow } = payload;
          const id = newRow.client_trade_id;
          const inst = newRow.instrument_name;

          startTransition(() => {
            setSignals((prev) => {
              // find previous version (if any)
              const prevSignal = prev.find((s) => s.client_trade_id === id);

              // Handle INSERT
              if (eventType === "INSERT" && newRow.exit_time == null) {
                toast.success(`Signal started for ${inst}`);
                new Audio("/audio/newSignal.mp3").play();
                return mode === "latest"
                  ? [newRow, ...prev.filter((s) => s.instrument_name !== inst)]
                  : [newRow, ...prev];
              }

              // Handle UPDATE
              if (eventType === "UPDATE") {
                const wasOpen = prevSignal?.exit_time == null;
                const isClosedNow = newRow.exit_time != null;

                // only fire on null → non-null
                if (wasOpen && isClosedNow) {
                  toast.success(`Signal closed for ${inst}`);
                  new Audio("/audio/endSignal.mp3").play();
                }

                return prev.map((s) =>
                  s.client_trade_id === id ? newRow : s
                );
              }

              // Handle DELETE
              if (eventType === "DELETE") {
                return prev.filter((s) => s.client_trade_id !== id);
              }

              return prev;
            });
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [mode]);

  return { signals, error };
}
