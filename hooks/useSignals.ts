"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import { createClient } from "@supabase/supabase-js";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Signal } from "@/lib/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type Mode = "all" | "latest";

export default function useSignals(mode: Mode = "latest") {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // 1. Initial fetch (SSR friendly)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from(
          mode === "latest"
            ? "latest_signals_per_instrument"
            : "all_signals",
        )
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

  // 2. Realtime
  useEffect(() => {
    // close any previous channel (React 18 strict-mode safe)
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`signals-${mode}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "all_signals" },
        (payload) => {
          const row = payload.new as Signal;
          startTransition(() => {
            setSignals((prev) => {
              switch (payload.eventType) {
                case "INSERT":
                  if (mode === "latest") {
                    // keep only one row per instrument
                    return [
                      row,
                      ...prev.filter(
                        (s) => s.instrument_name !== row.instrument_name,
                      ),
                    ];
                  }
                  return [row, ...prev];

                case "UPDATE":
                  return prev.map((s) =>
                    s.client_trade_id === row.client_trade_id ? row : s,
                  );

                case "DELETE":
                  return prev.filter(
                    (s) => s.client_trade_id !== payload.old?.client_trade_id,
                  );

                default:
                  return prev;
              }
            });
          });
        },
      )
      .subscribe((status) =>
        console.log("[realtime]", status),
      );

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [mode]);

  return { signals, error };
}
