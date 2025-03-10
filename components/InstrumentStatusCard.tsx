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
      <div className="flex h-[500px] w-full flex-col items-center justify-center p-4">
        <div className="flex w-full animate-pulse flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-1/3 rounded-md bg-slate-700"></div>
            <div className="h-5 w-16 rounded-md bg-slate-700"></div>
          </div>
          <div className="h-20 rounded-lg bg-slate-700"></div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="h-16 rounded-xl bg-slate-700"></div>
            <div className="h-16 rounded-xl bg-slate-700"></div>
            <div className="h-16 rounded-xl bg-slate-700"></div>
            <div className="h-16 rounded-xl bg-slate-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (statusError || !data || data.length === 0) {
    return (
      <div className="flex h-[400px] w-full flex-col items-center justify-center p-4">
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
    <div className="flex w-full flex-col p-4">
      {/* Header with status and time */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-slate-100">
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

      {/* REDESIGNED Featured Price and Trend Section - MUCH LARGER */}
      <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 via-slate-800/90 to-slate-900 p-6 shadow-lg">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Trend Section - Enhanced */}
          <div className="flex items-center space-x-5">
            <div className="relative">
              {getTrendIcon(trend, false)} {/* Using larger icon size */}
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-slate-800 ring-2 ring-slate-900"></div>
            </div>
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
                className={`text-3xl font-bold tracking-tight ${getTrendColor(trend)}`}
                animate={{ opacity: flashField === "trend" ? [1, 0.5, 1] : 1 }}
                transition={{ duration: 0.6 }}
              >
                {trend || t("unknown")}
              </motion.div>
            </div>
          </div>

          {/* Last Price Section - Enhanced */}
          <div className="flex items-center justify-end">
            <LastPriceDisplay
              instrumentName={instrumentName}
              size="large"
              showLabel={true}
              className="text-right"
            />
          </div>
        </div>

        {/* Add decorative elements */}
        <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-blue-500/5"></div>
        <div className="absolute -left-6 -top-6 h-16 w-16 rounded-full bg-purple-500/5"></div>
      </div>

      {/* Main Stats Grid - REDESIGNED with cards */}
      <div className="flex flex-col gap-4">
        {/* High/VAH row */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label={t("high")}
            tooltip={t("highTooltip")}
            value={compositeData.high?.value}
            isFlashing={flashField === "high"}
            t={t}
            icon={<ArrowUp size={18} className="text-green-400" />}
            theme="green"
          />

          <StatCard
            label="VAH"
            tooltip={t("vahTooltip")}
            value={compositeData.vah?.value}
            isFlashing={flashField === "vah"}
            variant="secondary"
            t={t}
            theme="blue"
          />
        </div>

        {/* Middle row - 3 columns */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            label="VWAP"
            tooltip={t("vwapTooltip")}
            value={compositeData.vwap?.value}
            isFlashing={flashField === "vwap"}
            t={t}
            theme="violet"
          />

          <StatCard
            label="POC"
            tooltip={t("pocTooltip")}
            value={compositeData.poc?.value}
            isFlashing={flashField === "poc"}
            t={t}
            theme="amber"
          />

          <StatCard
            label="VPOC"
            tooltip={t("vpocTooltip")}
            value={compositeData.vpoc?.value}
            isFlashing={flashField === "vpoc"}
            variant="secondary"
            t={t}
            theme="cyan"
          />
        </div>

        {/* Low/VAL row */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="VAL"
            tooltip={t("valTooltip")}
            value={compositeData.val?.value}
            isFlashing={flashField === "val"}
            variant="secondary"
            t={t}
            theme="indigo"
          />

          <StatCard
            label={t("low")}
            tooltip={t("lowTooltip")}
            value={compositeData.low?.value}
            isFlashing={flashField === "low"}
            t={t}
            icon={<ArrowDown size={18} className="text-red-400" />}
            theme="red"
          />
        </div>
      </div>

      {/* Footer with timestamp */}
      <div className="mt-4 flex items-center justify-end pt-1 text-xs text-slate-500">
        {compositeTimestamp
          ? new Date(compositeTimestamp).toLocaleString()
          : t("n/a")}
      </div>
    </div>
  );
};

// Helper components - now with compact option
interface StatCardProps {
  label: string;
  tooltip: string;
  value?: number;
  isFlashing?: boolean;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  t: any;
  theme?: "blue" | "green" | "red" | "amber" | "violet" | "cyan" | "indigo";
  compact?: boolean;
}

const StatCard = ({
  label,
  tooltip,
  value,
  isFlashing,
  variant = "primary",
  icon,
  t,
  theme = "blue",
  compact = false,
}: StatCardProps) => {
  const isPrimary = variant === "primary";

  // Get theme-specific classes
  const getThemeClasses = () => {
    const themeMap = {
      blue: "from-blue-800/20 to-blue-900/10 hover:from-blue-800/30 hover:to-blue-900/20",
      green:
        "from-green-800/20 to-green-900/10 hover:from-green-800/30 hover:to-green-900/20",
      red: "from-red-800/20 to-red-900/10 hover:from-red-800/30 hover:to-red-900/20",
      amber:
        "from-amber-800/20 to-amber-900/10 hover:from-amber-800/30 hover:to-amber-900/20",
      violet:
        "from-violet-800/20 to-violet-900/10 hover:from-violet-800/30 hover:to-violet-900/20",
      cyan: "from-cyan-800/20 to-cyan-900/10 hover:from-cyan-800/30 hover:to-cyan-900/20",
      indigo:
        "from-indigo-800/20 to-indigo-900/10 hover:from-indigo-800/30 hover:to-indigo-900/20",
    };

    return themeMap[theme] || themeMap.blue;
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-xl bg-gradient-to-br ${getThemeClasses()} p-3.5 shadow-lg transition-all duration-300 hover:shadow-xl ${isFlashing ? `ring-1 ring-${theme}-400/30` : ""}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <SignalToolTooltip text={tooltip}>
          <div className="flex cursor-help items-center gap-1 text-sm font-medium">
            {icon && <span className="mr-1">{icon}</span>}
            {label}
            <Info size={12} className="ml-0.5 opacity-60" />
          </div>
        </SignalToolTooltip>

        {/* Add a visual indicator dot */}
        <div className={`h-1.5 w-1.5 rounded-full bg-${theme}-500/50`}></div>

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

// Get trend icon with improved visuals
function getTrendIcon(trend?: string, small: boolean = false) {
  const iconSize = small ? 18 : 34; // Increased size
  const containerSize = small ? "h-8 w-8" : "h-16 w-16"; // Increased size

  if (!trend) {
    return <ArrowRight size={iconSize} className="text-slate-400" />;
  }

  switch (trend.toLowerCase()) {
    case "bullish":
      return (
        <div
          className={`relative flex ${containerSize} items-center justify-center rounded-full bg-gradient-to-br from-green-500/30 to-green-800/20 shadow-lg shadow-green-900/10`}
        >
          <ArrowUp size={iconSize} className="text-green-400" />
          {/* Add decorative elements */}
          <div className="absolute inset-0 rounded-full border border-green-400/10"></div>
        </div>
      );
    case "bearish":
      return (
        <div
          className={`relative flex ${containerSize} items-center justify-center rounded-full bg-gradient-to-br from-red-500/30 to-red-800/20 shadow-lg shadow-red-900/10`}
        >
          <ArrowDown size={iconSize} className="text-red-400" />
          {/* Add decorative elements */}
          <div className="absolute inset-0 rounded-full border border-red-400/10"></div>
        </div>
      );
    case "neutral":
      return (
        <div
          className={`relative flex ${containerSize} items-center justify-center rounded-full bg-gradient-to-br from-yellow-500/30 to-yellow-800/20 shadow-lg shadow-yellow-900/10`}
        >
          <ArrowRight size={iconSize} className="text-yellow-400" />
          {/* Add decorative elements */}
          <div className="absolute inset-0 rounded-full border border-yellow-400/10"></div>
        </div>
      );
    default:
      return <ArrowRight size={iconSize} className="text-slate-400" />;
  }
}

export default InstrumentStatusCard;
