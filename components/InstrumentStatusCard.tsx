"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useRef } from "react";
import useInstrumentStatus from "@/hooks/useInstrumentStatus";
import {
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Clock,
  AlertTriangle,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import SignalToolTooltip from "./SignalCard/SignalToolTooltip";
import LastPriceDisplay from "./LastPriceDisplay";

interface InstrumentStatusCardProps {
  instrumentName: string;
}

const InstrumentStatusCard = ({
  instrumentName,
}: InstrumentStatusCardProps) => {
  const {
    data,
    compositeData,
    isLoading: statusLoading,
    error: statusError,
  } = useInstrumentStatus(instrumentName);

  const t = useTranslations("InstrumentStatusCard");
  const [flashField, setFlashField] = useState<string | null>(null);
  const [prevValues, setPrevValues] = useState<Record<string, any>>({});
  const lastUpdateRef = useRef<number>(Date.now());

  // Track value changes to trigger flash animations
  useEffect(() => {
    if (compositeData) {
      const fieldsToCheck = [
        "trend",
        "high",
        "low",
        "vwap",
        "poc",
        "vah",
        "val",
        "vpoc",
      ];
      const currentTime = Date.now();

      // Only process animations if it's been at least 500ms since the last update
      if (currentTime - lastUpdateRef.current > 500) {
        for (const field of fieldsToCheck) {
          if (
            compositeData[field]?.value !== undefined &&
            prevValues[field] !== undefined &&
            compositeData[field].value !== prevValues[field]
          ) {
            setFlashField(field);
            setTimeout(() => setFlashField(null), 1000);
            lastUpdateRef.current = currentTime;
            break;
          }
        }
      }

      // Store current values for next comparison
      const newPrevValues: Record<string, any> = {};
      for (const field of fieldsToCheck) {
        if (compositeData[field]?.value !== undefined) {
          newPrevValues[field] = compositeData[field].value;
        }
      }
      setPrevValues(newPrevValues);
    }
  }, [compositeData]);

  if (statusLoading) {
    return (
      <div className="flex h-[600px] w-full flex-col items-center justify-center p-6">
        <div className="flex w-full animate-pulse flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="h-8 w-1/3 rounded-md bg-slate-700"></div>
            <div className="h-6 w-20 rounded-md bg-slate-700"></div>
          </div>
          <div className="h-24 rounded-lg bg-slate-700"></div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="h-24 rounded-xl bg-slate-700"></div>
            <div className="h-24 rounded-xl bg-slate-700"></div>
            <div className="h-24 rounded-xl bg-slate-700"></div>
            <div className="h-24 rounded-xl bg-slate-700"></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 rounded-lg bg-slate-700"></div>
            <div className="h-20 rounded-lg bg-slate-700"></div>
            <div className="h-20 rounded-lg bg-slate-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (statusError || !data || data.length === 0) {
    return (
      <div className="flex h-[600px] w-full flex-col items-center justify-center p-6">
        <div className="flex items-center space-x-3 text-amber-500">
          <AlertTriangle size={24} />
          <h3 className="text-xl font-medium">
            {statusError ? t("errorLoading") : t("noData")}
          </h3>
        </div>
        {statusError && (
          <p className="mt-3 text-slate-400">{statusError.message}</p>
        )}
      </div>
    );
  }

  const trend = compositeData.trend?.value || "";
  const compositeTimestamp =
    compositeData.latestTimestamp || (data && data[0]?.timestamp);

  return (
    <div className="flex h-[600px] w-full flex-col p-6">
      {/* Header with status and time */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-slate-100">
            {t("instrumentStatus")}
          </h3>
          <span className="flex h-2.5 w-2.5 items-center">
            <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
          </span>
        </div>
        <div className="flex items-center rounded-full bg-slate-700/50 px-3 py-1 text-xs text-slate-300">
          <Clock size={12} className="mr-1.5" />
          {compositeTimestamp
            ? new Date(compositeTimestamp).toLocaleTimeString()
            : t("n/a")}
        </div>
      </div>

      {/* Featured Price and Trend Section */}
      <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 shadow-lg">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Trend Section */}
          <div className="flex items-center space-x-4">
            {getTrendIcon(trend)}
            <div>
              <div className="mb-1 flex items-center gap-1">
                <SignalToolTooltip text={t("trendTooltip")}>
                  <div className="flex cursor-help items-center text-sm font-medium text-slate-400">
                    {t("trend")}
                    <Info size={12} className="ml-1 opacity-70" />
                  </div>
                </SignalToolTooltip>
              </div>
              <motion.div
                className={`text-2xl font-bold ${getTrendColor(trend)}`}
                animate={{ opacity: flashField === "trend" ? [1, 0.5, 1] : 1 }}
                transition={{ duration: 0.6 }}
              >
                {trend || t("unknown")}
              </motion.div>
            </div>
          </div>

          {/* Last Price Section */}
          <div className="flex items-center justify-end">
            <LastPriceDisplay
              instrumentName={instrumentName}
              size="large"
              showLabel={true}
              className="text-right"
            />
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label={t("high")}
          tooltip={t("highTooltip")}
          value={compositeData.high?.value}
          isFlashing={flashField === "high"}
          t={t}
          icon={<ArrowUp size={16} className="text-green-400" />}
        />

        <StatCard
          label={t("low")}
          tooltip={t("lowTooltip")}
          value={compositeData.low?.value}
          isFlashing={flashField === "low"}
          t={t}
          icon={<ArrowDown size={16} className="text-red-400" />}
        />

        <StatCard
          label="VWAP"
          tooltip={t("vwapTooltip")}
          value={compositeData.vwap?.value}
          isFlashing={flashField === "vwap"}
          t={t}
        />

        <StatCard
          label="POC"
          tooltip={t("pocTooltip")}
          value={compositeData.poc?.value}
          isFlashing={flashField === "poc"}
          t={t}
        />
      </div>

      {/* Value Area Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="VAH"
          tooltip={t("vahTooltip")}
          value={compositeData.vah?.value}
          isFlashing={flashField === "vah"}
          variant="secondary"
          t={t}
        />

        <StatCard
          label="VAL"
          tooltip={t("valTooltip")}
          value={compositeData.val?.value}
          isFlashing={flashField === "val"}
          variant="secondary"
          t={t}
        />

        <StatCard
          label="VPOC"
          tooltip={t("vpocTooltip")}
          value={compositeData.vpoc?.value}
          isFlashing={flashField === "vpoc"}
          variant="secondary"
          t={t}
        />
      </div>

      {/* Footer with timestamp */}
      <div className="mt-auto flex items-center justify-end pt-4 text-xs text-slate-500">
        {t("lastUpdated")}:{" "}
        {compositeTimestamp
          ? new Date(compositeTimestamp).toLocaleString()
          : t("n/a")}
      </div>
    </div>
  );
};

// Helper components
interface StatCardProps {
  label: string;
  tooltip: string;
  value?: number;
  isFlashing?: boolean;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  t: any;
}

const StatCard = ({
  label,
  tooltip,
  value,
  isFlashing,
  variant = "primary",
  icon,
  t,
}: StatCardProps) => {
  const isPrimary = variant === "primary";

  return (
    <div
      className={`flex flex-col justify-between rounded-xl p-4 ${
        isPrimary
          ? "bg-gradient-to-br from-slate-700/70 to-slate-800/70"
          : "bg-slate-800/50"
      } shadow-md backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${isFlashing ? "ring-1 ring-slate-400/30" : ""}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <SignalToolTooltip text={tooltip}>
          <div className="flex cursor-help items-center gap-1 text-sm font-medium text-slate-400">
            {label}
            {icon && <span className="ml-1">{icon}</span>}
            <Info size={12} className="ml-0.5 opacity-60" />
          </div>
        </SignalToolTooltip>

        {/* Visual indicator dot */}
        <div
          className={`h-1 w-1 rounded-full ${value !== undefined ? "bg-slate-400/30" : "bg-slate-600/30"}`}
        ></div>
      </div>

      <motion.div
        className={`text-xl font-bold tracking-tight ${isPrimary ? "" : "text-slate-300"}`}
        animate={{
          opacity: isFlashing ? [1, 0.5, 1] : 1,
          scale: isFlashing ? [1, 1.02, 1] : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        {value !== undefined ? value.toLocaleString() : t("n/a")}
      </motion.div>
    </div>
  );
};

// Helper function to determine color based on trend
function getTrendColor(trend?: string): string {
  if (!trend) return "text-slate-200";

  switch (trend.toLowerCase()) {
    case "bullish":
      return "text-green-400";
    case "bearish":
      return "text-red-400";
    case "neutral":
      return "text-yellow-400";
    default:
      return "text-slate-200";
  }
}

// Helper function to get trend icon
function getTrendIcon(trend?: string) {
  if (!trend) {
    return <ArrowRight size={24} className="text-slate-400" />;
  }

  switch (trend.toLowerCase()) {
    case "bullish":
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 shadow-md shadow-green-900/10">
          <ArrowUp size={24} className="text-green-400" />
        </div>
      );
    case "bearish":
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 shadow-md shadow-red-900/10">
          <ArrowDown size={24} className="text-red-400" />
        </div>
      );
    case "neutral":
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 shadow-md shadow-yellow-900/10">
          <ArrowRight size={24} className="text-yellow-400" />
        </div>
      );
    default:
      return <ArrowRight size={24} className="text-slate-400" />;
  }
}

export default InstrumentStatusCard;
