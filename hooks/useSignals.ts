"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import { createClient, type RealtimeChannel } from "@supabase/supabase-js";
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

  const channelRef       = useRef<RealtimeChannel | null>(null);
  const notifiedRef      = useRef<Record<string, { opened: boolean; closed: boolean }>>({});
  const lastNotifTimeRef = useRef<{ opened: number; closed: number }>({
    opened: 0,
    closed: 0,
  });

  /* ------------------------------------------------------------------ */
  /* 1. Initial fetch (SSR-friendly)                                    */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from(mode === "latest" ? "latest_signals_per_instrument" : "all_signals")
        .select("*")
        .order("entry_time", { ascending: false });

      if (cancelled) return;
      if (error)     return setError(error.message);

      setSignals(data as Signal[]);
    })();

    return () => { cancelled = true };
  }, [mode]);

  /* ------------------------------------------------------------------ */
  /* 2. Realtime subscription                                           */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current); // cleanup on remount
    }

    const channel = supabase
      .channel(`signals-${mode}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "all_signals" },
        (payload) => {
          const eventType   = payload.eventType;
          const newRow      = payload.new as Signal;
          const key         = mode === "latest" ? newRow.instrument_name : newRow.client_trade_id;
          const hasExitTime = newRow.exit_time != null;

          if (!notifiedRef.current[key]) {
            notifiedRef.current[key] = { opened: false, closed: false };
          }

          startTransition(() => {
            setSignals((prev) => {
              /* --------------------- INSERT (open trade) -------------------- */
              if (eventType === "INSERT" && !hasExitTime) {
                /* ––– latest mode: always REPLACE older row of same instrument ––– */
                if (mode === "latest") {
                  if (!notifiedRef.current[key].opened) {
                    const now = Date.now();
                    if (now - lastNotifTimeRef.current.opened > 1_000) {
                      toast.success(`Signal started for ${newRow.instrument_name}`);
                      new Audio("/audio/newSignal.mp3").play();
                      fetch("/api/notifyNewSignal", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newRow),
                      }).catch(console.error);
                      lastNotifTimeRef.current.opened = now;
                    }
                    notifiedRef.current[key].opened = true;
                  }
                  return [
                    newRow,
                    ...prev.filter((s) => s.instrument_name !== newRow.instrument_name),
                  ];
                }

                /* ––– all mode: keep duplicates out by client_trade_id ––– */
                if (prev.some((s) => s.client_trade_id === key)) return prev;

                if (!notifiedRef.current[key].opened) {
                  const now = Date.now();
                  if (now - lastNotifTimeRef.current.opened > 1_000) {
                    toast.success(`Signal started for ${newRow.instrument_name}`);
                    new Audio("/audio/newSignal.mp3").play();
                    fetch("/api/notifyNewSignal", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(newRow),
                    }).catch(console.error);
                    lastNotifTimeRef.current.opened = now;
                  }
                  notifiedRef.current[key].opened = true;
                }
                return [newRow, ...prev];
              }

              /* --------------------- UPDATE (close trade) ------------------- */
              if (eventType === "UPDATE") {
                const isClosing =
                  hasExitTime &&
                  prev.some(
                    (s) =>
                      (mode === "latest" ? s.instrument_name : s.client_trade_id) === key &&
                      s.exit_time == null,
                  );

                if (isClosing && !notifiedRef.current[key].closed) {
                  const now = Date.now();
                  if (now - lastNotifTimeRef.current.closed > 1_000) {
                    toast.success(`Signal closed for ${newRow.instrument_name}`);
                    new Audio("/audio/endSignal.mp3").play();
                    fetch("/api/notifyNewSignal", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(newRow),
                    }).catch(console.error);
                    lastNotifTimeRef.current.closed = now;
                  }
                  notifiedRef.current[key].closed = true;
                }

                return prev.map((s) =>
                  (mode === "latest" ? s.instrument_name : s.client_trade_id) === key
                    ? newRow
                    : s,
                );
              }

              /* --------------------- DELETE --------------------------------- */
              if (eventType === "DELETE") {
                return prev.filter(
                  (s) =>
                    (mode === "latest" ? s.instrument_name : s.client_trade_id) !== key,
                );
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
