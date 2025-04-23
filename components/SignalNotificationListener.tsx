"use client";

import { useEffect, useRef } from "react";
import useSignals from "@/hooks/useSignals";
import { useSignalNotifications } from "@/hooks/useSignalNotifications";

/**
 * Listens for real-time signal events and sends one notification per new or completed signal.
 */
export default function SignalNotificationListener() {
  console.log("[SignalNotificationListener] mounted");
  const { signals } = useSignals("all");
  const { notifyNewSignal, notifyCompletedSignal } = useSignalNotifications();

  // Ref to store previous signal state by trade ID
  const prevStateRef = useRef<Map<string, number | null>>(new Map());

  useEffect(() => {
    console.log(
      `[SignalNotificationListener] useEffect triggered: ${signals.length} signals`,
      signals,
    );
    signals.forEach((sig) => {
      console.log(
        `[SignalNotificationListener] Processing signal: id=${sig.client_trade_id}, prevExit=${prevStateRef.current.get(sig.client_trade_id)}, currExit=${sig.exit_price}`,
      );
      const key = sig.client_trade_id;
      const prevExit = prevStateRef.current.get(key);
      const currExit = sig.exit_price;

      // New signal if never seen before
      if (prevExit === undefined) {
        console.log(
          `[SignalNotificationListener] Detected NEW signal for ${key}`,
        );
        notifyNewSignal(sig.instrument_name, {
          price: sig.entry_price,
          direction: sig.trade_side,
          time: sig.entry_time,
        });
      }
      // Completed if was seen with null exit and now has exit
      else if (prevExit === null && currExit != null) {
        console.log(
          `[SignalNotificationListener] Detected COMPLETED signal for ${key}`,
        );
        notifyCompletedSignal(sig.instrument_name, {
          price: currExit,
          entryPrice: sig.entry_price,
          direction: sig.trade_side,
          time: sig.exit_time,
        });
      }

      prevStateRef.current.set(key, currExit);
    });
  }, [signals, notifyNewSignal, notifyCompletedSignal]);

  return null;
}
