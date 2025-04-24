import { useEffect, useRef } from "react";
import useSignals from "./useSignals";
import usePreferences from "./usePreferences";
import { useUser } from "@/providers/UserProvider";

export default function useTradeNotifications() {
  const { user } = useUser();
  const userId = user?.id;
  const { signals } = useSignals("all");
  const { notificationsOn } = usePreferences(userId);

  const firstRun = useRef(true);
  const lastStartRef = useRef<Record<string, string>>({});
  const lastEndRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!userId) return;

    // On initial load, seed last known times for instruments in preferences
    if (firstRun.current) {
      signals.forEach((s) => {
        const inst = s.instrument_name;
        if (!notificationsOn.includes(inst)) return;
        lastStartRef.current[inst] = s.entry_time;
        lastEndRef.current[inst] = s.exit_time || "";
      });
      firstRun.current = false;
      return;
    }

    signals.forEach((s) => {
      const inst = s.instrument_name;
      if (!notificationsOn.includes(inst)) return;
      const prevStart = lastStartRef.current[inst] || "";
      const prevEnd = lastEndRef.current[inst] || "";

      // New signal start
      if (s.entry_time > prevStart) {
        fetch("/api/notifications/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            type: "signal",
            title: `Signal started: ${inst}`,
            message: `${s.trade_side} @ ${s.entry_price}`,
            link: `/signals/${inst}`,
          }),
        });
        lastStartRef.current[inst] = s.entry_time;
      }

      // Signal end
      if (s.exit_time && s.exit_time > prevEnd) {
        fetch("/api/notifications/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            type: "signal",
            title: `Signal ended: ${inst}`,
            message: `${s.trade_side} closed @ ${s.exit_price}`,
            link: `/signals/${inst}`,
          }),
        });
        lastEndRef.current[inst] = s.exit_time;
      }
    });
  }, [signals, notificationsOn, userId]);
}
