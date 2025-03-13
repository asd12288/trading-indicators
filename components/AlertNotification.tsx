"use client";

import useAlerts from "@/hooks/useAlerts";
import usePreferences from "@/hooks/usePreferences";
import useProfile from "@/hooks/useProfile";
import { Link } from "@/i18n/routing";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface AlertNotificationProps {
  userId: string;
  instrumentName?: string;
  variant?: "default" | "compact";
}

const AlertNotification = ({
  userId,
  instrumentName = "",
  variant = "default",
}) => {
  const { alerts, isLoading } = useAlerts(userId);
  const { notificationsOn } = usePreferences(userId);
  const { isPro } = useProfile(userId);
  const t = useTranslations("Alert");

  const isCompact = variant === "compact";

  if (isLoading) {
    return (
      <div className="flex h-16 w-full items-center justify-center gap-2 rounded-lg bg-slate-800/80 px-4">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400"></div>
        <span className="text-slate-300">{t("loading")}</span>
      </div>
    );
  }

  // Filter alerts based on the passed instrumentName first, if provided
  const filteredAlerts = instrumentName
    ? alerts.filter((alert) => alert.instrument_name === instrumentName)
    : isPro
      ? alerts.filter((alert) =>
          notificationsOn.includes(alert.instrument_name),
        )
      : alerts;

  // Check if we have any alerts to display
  if (!filteredAlerts || filteredAlerts.length === 0) {
    return (
      <div className="flex h-16 w-full items-center justify-center rounded-lg bg-slate-800/80 px-4 text-sm text-slate-300">
        {instrumentName
          ? t("messages.noAlertsForInstrument", { instrument: instrumentName })
          : isPro
            ? t("noAlertsPro")
            : t("noAlertsDefault")}
      </div>
    );
  }

  const lastAlert = filteredAlerts[0];
  const { instrument_name, price, time_utc, time, trade_direction } = lastAlert;
  const actualTime = time_utc || time;
  const isLong = trade_direction === "LONG";

  // Check if alert is older than 5 minutes
  const currentTime = new Date();
  const alertTime = new Date(actualTime);
  const fiveMinutesMs = 5 * 60 * 1000; // 5 minutes in milliseconds

  if (currentTime.getTime() - alertTime.getTime() > fiveMinutesMs) {
    // Alert is too old, show a message instead of nothing
    return (
      <div className="flex h-16 w-full items-center justify-center rounded-lg bg-slate-800/80 px-4 text-sm text-slate-300">
        <div className="flex flex-col items-center gap-1 text-center">
          <Clock className="h-4 w-4 text-slate-400" />
          <span>
            {instrumentName
              ? t("messages.noRecentAlertsForInstrument", {
                  instrument: instrumentName,
                })
              : t("messages.noRecentAlerts", {
                  defaultValue: "No recent alerts available",
                })}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/smart-alerts/${instrument_name}`}
      className="group block w-full"
    >
      <motion.div
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
        className={cn(
          "relative overflow-hidden rounded-lg border shadow-md transition-all",
          isLong
            ? "border-green-600/40 bg-green-900/20 hover:border-green-500/60"
            : "border-red-600/40 bg-red-900/20 hover:border-red-500/60",
          isCompact ? "px-3 py-2" : "px-4 py-3",
        )}
      >
        <div className="flex items-start gap-3">
          {/* Left section with direction icon */}
          <div
            className={cn(
              "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full",
              isCompact ? "h-9 w-9" : "h-12 w-12",
              isLong
                ? "bg-green-500/30 text-green-400"
                : "bg-red-500/30 text-red-400",
            )}
          >
            {isLong ? (
              <ArrowUpRight
                className={isCompact ? "h-5 w-5" : "h-6 w-6"}
                strokeWidth={2.5}
              />
            ) : (
              <ArrowDownRight
                className={isCompact ? "h-5 w-5" : "h-6 w-6"}
                strokeWidth={2.5}
              />
            )}
          </div>

          {/* Content section */}
          <div className="flex-1">
            {/* Top row - Instrument & Opportunity */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "font-bold",
                    isCompact ? "text-sm" : "text-lg",
                    isLong ? "text-green-100" : "text-red-100",
                  )}
                >
                  {instrument_name}
                </span>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-xs font-medium uppercase tracking-wider",
                    isLong
                      ? "bg-green-500/30 text-green-300"
                      : "bg-red-500/30 text-red-300",
                  )}
                >
                  {isLong ? "LONG" : "SHORT"}
                </span>
              </div>

              <div
                className={cn(
                  "flex items-center text-xs text-slate-400",
                  isCompact && "hidden sm:flex",
                )}
              >
                <Clock className="mr-1 h-3 w-3" />
                {actualTime && format(new Date(actualTime), "HH:mm")}
              </div>
            </div>

            {/* Middle row - Price & Movement */}
            <div className="mt-1.5 flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span
                  className={cn(
                    "font-bold tabular-nums tracking-tight",
                    isCompact ? "text-base" : "text-xl",
                    isLong ? "text-green-400" : "text-red-400",
                  )}
                >
                  {price}
                </span>
              </div>
            </div>

            {/* Action hint */}
            <div className="mt-1.5 flex items-center justify-between">
              <div
                className={cn(
                  "flex items-center rounded-full px-2 py-0.5",
                  isLong
                    ? "bg-green-500/20 text-green-300"
                    : "bg-red-500/20 text-red-300",
                )}
              >
                <Sparkles className="mr-1 h-3 w-3" />
                <span className="text-xs font-medium">
                  {isLong
                    ? "Trading Opportunity: Buy"
                    : "Trading Opportunity: Sell"}
                </span>
              </div>

              <ChevronRight className="h-4 w-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

// Helper function for conditional classes
const cn = (...classes) => classes.filter(Boolean).join(" ");

export default AlertNotification;
