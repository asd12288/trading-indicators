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
import { motion, AnimatePresence } from "framer-motion";
import SignalToolTooltip from "./SignalCard/SignalToolTooltip";

interface InstrumentStatusCardProps {
  instrumentName: string;
}

const InstrumentStatusCard = ({
  instrumentName,
}: InstrumentStatusCardProps) => {
  const { data, compositeData, isLoading, error } =
    useInstrumentStatus(instrumentName);
  const t = useTranslations("InstrumentStatusCard");
  const [flashField, setFlashField] = useState<string | null>(null);
  const [prevValues, setPrevValues] = useState<Record<string, any>>({});
  const lastUpdateRef = useRef<number>(Date.now());

  // Track value changes to trigger flash animations
  useEffect(() => {
    if (compositeData) {
      const fieldsToCheck = [
        "last",
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
      // This prevents too many animations firing at once
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

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-5 rounded-xl border border-slate-700/50 bg-slate-800/90 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        <div className="flex w-full animate-pulse flex-col gap-4">
          <div className="h-7 w-1/3 rounded bg-slate-700"></div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="h-20 rounded bg-slate-700"></div>
            <div className="h-20 rounded bg-slate-700"></div>
            <div className="hidden h-20 rounded bg-slate-700 md:block"></div>
            <div className="hidden h-20 rounded bg-slate-700 md:block"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-5 rounded-xl border border-slate-700/50 bg-slate-800/90 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center space-x-2 text-amber-500">
          <AlertTriangle size={20} />
          <h3 className="text-lg font-medium">{t("errorLoading")}</h3>
        </div>
        <p className="mt-2 text-slate-400">{error.message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-5 rounded-xl border border-slate-700/50 bg-slate-800/90 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center space-x-2 text-slate-400">
          <AlertTriangle size={20} />
          <h3 className="text-lg font-medium">{t("noData")}</h3>
        </div>
      </div>
    );
  }

  const trend = compositeData.trend?.value || "";
  const lastPrice = compositeData.last?.value;

  // Get the most recent timestamp for display
  const latestTimestamp = compositeData.latestTimestamp || data[0]?.timestamp;

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-slate-700/50 bg-slate-800/90 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-slate-100">
            {t("instrumentStatus")}
          </h3>
          {compositeData.last?.value !== undefined && (
            <span className="flex h-2 w-2 items-center">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
          )}
        </div>
        <div className="flex items-center text-xs text-slate-400">
          <Clock size={14} className="mr-1" />
          {latestTimestamp
            ? new Date(latestTimestamp).toLocaleTimeString()
            : t("n/a")}
        </div>
      </div>

      {/* Trend and Last Price - Featured Section */}
      <div className="mb-4 flex flex-col rounded-lg bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-4 shadow-md md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          {getTrendIcon(trend)}
          <div className="ml-3">
            <div className="flex items-center gap-1">
              <SignalToolTooltip text={t("trendTooltip")}>
                <div className="flex cursor-help items-center text-sm font-medium text-slate-400">
                  {t("trend")}
                  <Info size={12} className="ml-1 opacity-70" />
                </div>
              </SignalToolTooltip>
            </div>
            <motion.div
              className={`text-xl font-bold ${getTrendColor(trend)}`}
              animate={{ opacity: flashField === "trend" ? [1, 0.5, 1] : 1 }}
              transition={{ duration: 0.6 }}
            >
              {trend || t("unknown")}
            </motion.div>
          </div>
        </div>

        <div className="mt-3 flex items-center md:mt-0">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1">
              <SignalToolTooltip text={t("lastPriceTooltip")}>
                <div className="flex cursor-help items-center text-sm font-medium text-slate-400">
                  {t("lastPrice")}
                  <Info size={12} className="ml-1 opacity-70" />
                </div>
              </SignalToolTooltip>
            </div>
            <motion.div
              className="text-primary text-2xl font-bold"
              animate={{
                opacity: flashField === "last" ? [1, 0.5, 1] : 1,
                scale: flashField === "last" ? [1, 1.03, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              {lastPrice !== undefined ? lastPrice.toLocaleString() : t("n/a")}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="flex-grow">
        {/* Price Levels Grid */}
        <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label={t("high")}
            tooltip={t("highTooltip")}
            value={compositeData.high?.value}
            isFlashing={flashField === "high"}
            t={t}
          />

          <StatCard
            label={t("low")}
            tooltip={t("lowTooltip")}
            value={compositeData.low?.value}
            isFlashing={flashField === "low"}
            t={t}
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

        {/* Value Areas */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <StatCard
            label="VAH"
            tooltip={t("vahTooltip")}
            value={compositeData.vah?.value}
            isFlashing={flashField === "vah"}
            isSmaller
            t={t}
          />

          <StatCard
            label="VAL"
            tooltip={t("valTooltip")}
            value={compositeData.val?.value}
            isFlashing={flashField === "val"}
            isSmaller
            t={t}
          />

          <StatCard
            label="VPOC"
            tooltip={t("vpocTooltip")}
            value={compositeData.vpoc?.value}
            isFlashing={flashField === "vpoc"}
            isSmaller
            t={t}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end text-xs text-slate-500">
        {t("lastUpdated")}:{" "}
        {latestTimestamp
          ? new Date(latestTimestamp).toLocaleString()
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
  isSmaller?: boolean;
  t: any;
}

const StatCard = ({
  label,
  tooltip,
  value,
  isFlashing,
  isSmaller = false,
  t,
}: StatCardProps) => {
  return (
    <div
      className={`rounded-lg ${
        isSmaller ? "bg-slate-800/70" : "bg-slate-700/60"
      } p-2.5 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:bg-slate-700/80`}
    >
      <SignalToolTooltip text={tooltip}>
        <p className="flex cursor-help items-center gap-1 text-sm text-slate-400">
          {label}
          <Info size={12} className="opacity-70" />
        </p>
      </SignalToolTooltip>
      <motion.p
        className={`${isSmaller ? "text-base" : "text-lg"} font-bold`}
        animate={{
          opacity: isFlashing ? [1, 0.5, 1] : 1,
          scale: isFlashing ? [1, 1.02, 1] : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        {value !== undefined ? value.toLocaleString() : t("n/a")}
      </motion.p>
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
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/20">
          <ArrowUp size={20} className="text-green-400" />
        </div>
      );
    case "bearish":
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/20">
          <ArrowDown size={20} className="text-red-400" />
        </div>
      );
    case "neutral":
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-500/20">
          <ArrowRight size={20} className="text-yellow-400" />
        </div>
      );
    default:
      return <ArrowRight size={24} className="text-slate-400" />;
  }
}

export default InstrumentStatusCard;
