"use client";

import { useEffect, useRef } from "react";
import useAlerts from "@/hooks/useAlerts";
import usePreferences from "@/hooks/usePreferences";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { formatDistanceToNow } from "date-fns";

const AlertToastProvider = () => {
  // Get auth context for current user
  const { user } = useAuth();
  const router = useRouter();

  // Only proceed if we have a user
  if (!user?.id) return null;

  // Get user preferences
  const { notificationsOn } = usePreferences(user.id);

  // Subscribe to alerts with the onNewAlert callback
  const { onNewAlert } = useAlerts();

  // Keep track of already shown alerts to prevent duplicates
  const shownAlertsRef = useRef<Set<string>>(new Set());

  // Handle new alert
  useEffect(() => {
    const handleNewAlert = (alert) => {
      // Skip if notifications are disabled for this instrument
      if (!notificationsOn.includes(alert.instrument_name)) {
        return;
      }

      // Generate a unique ID for this alert
      const alertId = `${alert.instrument_name}-${alert.time_utc || alert.time}`;

      // Skip if we've already shown this alert
      if (shownAlertsRef.current.has(alertId)) {
        return;
      }

      // Mark this alert as shown
      shownAlertsRef.current.add(alertId);

      // Determine if this is a buy or sell signal
      const isLong = alert.trade_direction === "LONG";

      // Show the toast notification
      toast({
        title: (
          <div className="flex items-center gap-2">
            <div
              className={`rounded-full p-1 ${isLong ? "bg-green-500/30" : "bg-red-500/30"}`}
            >
              {isLong ? (
                <ArrowUpRight className="h-4 w-4 text-green-400" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-400" />
              )}
            </div>
            <span>
              New {isLong ? "Buy" : "Sell"} Signal: {alert.instrument_name}
            </span>
          </div>
        ),
        description: (
          <div className="flex justify-between">
            <span>
              Price:{" "}
              <strong>
                {typeof alert.price === "number"
                  ? alert.price.toFixed(2)
                  : alert.price}
              </strong>
            </span>
            <span className="text-sm text-slate-400">
              {alert.time_utc &&
                formatDistanceToNow(new Date(alert.time_utc), {
                  addSuffix: true,
                })}
            </span>
          </div>
        ),
        action: (
          <button
            className="rounded-md bg-slate-900 px-3 py-2 text-white hover:bg-slate-700"
            onClick={() =>
              router.push(`/smart-alerts/${alert.instrument_name}`)
            }
          >
            View
          </button>
        ),
        variant: "default",
        className: isLong
          ? "border border-green-500/30 bg-green-900/40"
          : "border border-red-500/30 bg-red-900/40",
      });
    };

    // Register callback
    const unsubscribe = onNewAlert(handleNewAlert);

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, [notificationsOn, onNewAlert, router]);

  // This component doesn't render anything
  return null;
};

export default AlertToastProvider;
