"use client";

import useAlerts from "@/hooks/useAlerts";
import usePreferences from "@/hooks/usePreferences";
import useProfile from "@/hooks/useProfile";
import { Link } from "@/i18n/routing";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Bell,
  TrendingUp,
  TrendingDown,
  Clock,
  ExternalLink,
  BarChart3,
  PercentIcon,
  ChevronRight,
} from "lucide-react";

interface AlertNotificationProps {
  userId: string;
  instrumentName?: string;
}

const AlertNotification = ({
  userId,
  instrumentName = "",
}: AlertNotificationProps) => {
  const { alerts, isLoading } = useAlerts();
  const { notificationsOn } = usePreferences(userId);
  const { isPro } = useProfile(userId);
  const t = useTranslations("Alert");

  // Add debug logging
  console.log("Alerts in component:", alerts);
  console.log("User preferences:", { isPro, notificationsOn, instrumentName });

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

  console.log("Filtered alerts:", filteredAlerts);

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

  // Use time_utc instead of time if that's how the field is named in your database
  if (lastAlert.time_utc || lastAlert.time) {
    const now = new Date();
    const alertTime = new Date(lastAlert.time_utc || lastAlert.time);
    const minutesDiff = (now.getTime() - alertTime.getTime()) / (1000 * 60);

    console.log("Alert time check:", { now, alertTime, minutesDiff });

    // Optionally increase this threshold if needed
    if (minutesDiff > 5) {
      return (
        <div className="flex h-16 w-full items-center justify-center rounded-lg bg-slate-800/80 px-4 text-sm text-slate-300">
          {t("messages.noRecentAlerts")}
        </div>
      );
    }
  }

  // Make sure we're using the right field names that match your database schema
  const { instrument_name, price, time_utc, time, trade_direction } = lastAlert;
  const actualTime = time_utc || time;
  const isLong = trade_direction === "LONG";

  // New: Extract additional information (mock data for illustration)
  const alertPriority = lastAlert.priority || "medium"; // high, medium, low
  const alertType = lastAlert.type || "price_level"; // price_level, trend_change, volatility
  const priceMovement = lastAlert.priceMovement || (isLong ? 0.82 : -0.74); // % movement
  const volume = lastAlert.volume || "125.4K";
  const prevClose = price * (1 - priceMovement / 100);

  // Helper function to format percentage
  const formatPercentage = (value) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  // Helper to determine priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-rose-500";
      case "medium":
        return "bg-amber-500";
      case "low":
        return "bg-slate-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <Link href="/alerts" className="group block w-full">
      <motion.div
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
        className={`flex w-full items-center overflow-hidden rounded-lg border ${
          isLong
            ? "border-green-500 bg-green-950/20"
            : "border-red-500 bg-red-950/20"
        } px-4 py-3 shadow-sm transition-all hover:bg-slate-800/80`}
      >
        {/* Left section with alert icon and priority indicator */}
        <div className="relative mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-800/80">
          <Bell
            className={`h-6 w-6 ${isLong ? "text-green-400" : "text-red-400"}`}
          />
          <div
            className={`absolute -right-1 -top-1 h-3 w-3 rounded-full ${getPriorityColor(alertPriority)} ring-2 ring-slate-900`}
          ></div>
        </div>

        <div className="flex flex-1 flex-col">
          {/* Top row - Instrument & Time */}
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2 font-bold text-slate-100">
                {instrument_name}
              </span>
              {isLong ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
            </div>

            <div className="flex items-center text-xs text-slate-400"></div>
            <Clock className="mr-1 h-3 w-3" />
            {actualTime && format(new Date(actualTime), "HH:mm")}
          </div>
        </div>

        {/* Middle row - Price & Movement */}
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-slate-300">
              {t("messages.level")}
            </span>
            <span
              className={`text-lg font-bold tabular-nums tracking-wide ${
                isLong ? "text-green-400" : "text-red-400"
              }`}
            >
              {typeof price === "number" ? price.toFixed(2) : price}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <PercentIcon className="h-3 w-3 text-slate-400" />
            <span
              className={`text-sm font-medium tabular-nums ${priceMovement >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {formatPercentage(priceMovement)}
            </span>
          </div>
        </div>

        {/* Bottom row - Alert type & Volume */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-700/60 px-2 py-0.5 text-xs text-slate-300">
              {alertType === "price_level"
                ? "Price Alert"
                : alertType === "trend_change"
                  ? "Trend Change"
                  : "Volatility Alert"}
            </span>
            <span className="flex items-center text-xs text-slate-400">
              <BarChart3 className="mr-1 h-3 w-3" />
              {volume}
            </span>
          </div>

          <div className="flex items-center">
            <ExternalLink className="h-4 w-4 text-blue-400 opacity-0 transition-opacity group-hover:opacity-100" />
            <ChevronRight className="ml-1 h-4 w-4 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default AlertNotification;
