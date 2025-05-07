"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import { createClient } from "@supabase/supabase-js";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Signal } from "@/lib/types";
import { toast } from "sonner";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type Mode = "all" | "latest";

export default function useSignals(mode: Mode = "latest") {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const notifiedRef = useRef<
    Record<string, { opened: boolean; closed: boolean }>
  >({});
  // track last notification timestamps to debounce
  const lastNotifTimeRef = useRef<{ opened: number; closed: number }>({
    opened: 0,
    closed: 0,
  });

  // 1. Initial fetch (SSR-friendly)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from(
          mode === "latest" ? "latest_signals_per_instrument" : "all_signals",
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
          const eventType = payload.eventType;
          const newRow = payload.new as Signal;
          const id = newRow.client_trade_id;
          const inst = newRow.instrument_name;
          if (!notifiedRef.current[id]) {
            notifiedRef.current[id] = { opened: false, closed: false };
          }

          startTransition(() => {
            setSignals((prev) => {
              // find previous version (if any)
              const prevSignal = prev.find((s) => s.client_trade_id === id);

              // Handle INSERT - skip if already exists
              if (eventType === "INSERT" && newRow.exit_time == null) {
                if (prev.find((s) => s.client_trade_id === id)) {
                  return prev;
                }
                if (!notifiedRef.current[id].opened) {
                  const now = Date.now();
                  if (now - lastNotifTimeRef.current.opened > 1000) {
                    toast.success(`Signal started for ${inst}`);
                    new Audio("/audio/newSignal.mp3").play();
                    fetch("/api/notifyNewSignal", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(newRow),
                    }).catch(console.error);
                    lastNotifTimeRef.current.opened = now;
                  }
                  notifiedRef.current[id].opened = true;
                }
                return mode === "latest"
                  ? [newRow, ...prev.filter((s) => s.client_trade_id !== id)]
                  : [newRow, ...prev];
              }

              // Handle UPDATE
              if (eventType === "UPDATE") {
                const wasOpen = prevSignal?.exit_time == null;
                const isClosedNow = newRow.exit_time != null;

                // only fire on null → non-null
                if (wasOpen && isClosedNow) {
                  if (!notifiedRef.current[id].closed) {
                    const now = Date.now();
                    if (now - lastNotifTimeRef.current.closed > 1000) {
                      toast.success(`Signal closed for ${inst}`);
                      new Audio("/audio/endSignal.mp3").play();
                      fetch("/api/notifyNewSignal", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newRow),
                      }).catch(console.error);
                      lastNotifTimeRef.current.closed = now;
                    }
                    notifiedRef.current[id].closed = true;
                  }
                }

                return prev.map((s) => (s.client_trade_id === id ? newRow : s));
              }

              // Handle DELETE
              if (eventType === "DELETE") {
                return prev.filter((s) => s.client_trade_id !== id);
              }

              return prev;
            });
          });
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [mode]);

  return { signals, error };
}
