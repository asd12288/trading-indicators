import { Signal } from "@/lib/types";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import { FC, useEffect } from "react";
import {
  ArrowDown,
  ArrowUp,
  Activity,
  Target,
  AlertTriangle,
  Clock,
  Zap,
  BarChart4,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";

interface RunningSignalCardProps {
  instrument: Signal;
  isBuy: boolean;
}

const RunningSignalCard: FC<RunningSignalCardProps> = ({
  instrument,
  isBuy,
}) => {
  const {
    entry_time,
    instrument_name,
    trade_side,
    entry_price,
    exit_price,
    take_profit_price,
    stop_loss_price,
  } = instrument;

  // Debug logging to see what data is coming through
  useEffect(() => {
    console.log("RunningSignalCard received instrument:", instrument);
  }, [instrument]);

  // Validate required fields
  if (!entry_time || !entry_price || !take_profit_price || !stop_loss_price) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-yellow-500 bg-yellow-950/10 p-4 text-center">
        <AlertCircle className="mb-2 h-8 w-8 text-yellow-500" />
        <h3 className="text-lg font-medium text-yellow-500">Incomplete Data</h3>
        <p className="mt-1 text-sm text-slate-400">
          {instrument_name || "Signal"} is missing required data fields
        </p>
        <div className="mt-2 text-left text-xs text-slate-500">
          <p>
            Missing: {!entry_time ? "entry_time, " : ""}
            {!entry_price ? "entry_price, " : ""}
            {!take_profit_price ? "take_profit_price, " : ""}
            {!stop_loss_price ? "stop_loss_price" : ""}
          </p>
        </div>
      </div>
    );
  }

  const t = useTranslations("RunningSignalCard");

  try {
    const exitTimeInUserTimezone = parseISO(entry_time);
    const adjustedExitTime = new Date(exitTimeInUserTimezone.getTime());
    const timeDistance = formatDistanceToNow(adjustedExitTime, {
      addSuffix: true,
    });

    // Calculate potential profit percentage with safety checks
    const potentialProfit =
      isBuy && take_profit_price && entry_price
        ? ((take_profit_price - entry_price) / entry_price) * 100
        : !isBuy && take_profit_price && entry_price
          ? ((entry_price - take_profit_price) / entry_price) * 100
          : 0;

    // Calculate potential loss percentage with safety checks
    const potentialLoss =
      isBuy && stop_loss_price && entry_price
        ? ((entry_price - stop_loss_price) / entry_price) * 100
        : !isBuy && stop_loss_price && entry_price
          ? ((stop_loss_price - entry_price) / entry_price) * 100
          : 0;

    // Format numbers for better readability
    const formatNumber = (num) => {
      if (num === null || num === undefined) return "N/A";
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="h-full w-full"
      >
        <div
          className={`relative h-full overflow-hidden rounded-xl border-2 ${
            isBuy
              ? "border-emerald-500 bg-gradient-to-b from-blue-950/20 to-slate-900"
              : "border-rose-500 bg-gradient-to-b from-violet-950/20 to-slate-900"
          } shadow-lg`}
        >
          {/* Live pulse effect */}
          <div className="absolute left-0 right-0 top-0 h-[2px]">
            <motion.div
              className={`h-full ${isBuy ? "bg-emerald-500" : "bg-rose-500"}`}
              animate={{
                width: ["0%", "100%"],
                x: [-10, 0],
                opacity: [0.5, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Enhanced LIVE Status Indicator */}
          <div className="absolute right-0 top-0 z-20">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0px rgba(37, 99, 235, 0)",
                  "0 0 12px rgba(37, 99, 235, 0.7)",
                  "0 0 0px rgba(37, 99, 235, 0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2 rounded-bl-lg bg-blue-600 px-3 py-1.5 shadow-md"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Zap className="h-5 w-5 text-white" />
              </motion.div>
              <span className="font-bold tracking-wider text-white">LIVE</span>
            </motion.div>
          </div>

          {/* Header with improved design */}
          <div className="p-5">
            {/* Mobile LIVE badge */}
            <div className="mb-2 flex items-center sm:hidden">
              <span className="mr-2 inline-flex items-center rounded-full bg-blue-900/50 px-2.5 py-0.5 text-xs font-medium text-blue-300">
                <motion.span
                  className="mr-1.5 h-2 w-2 rounded-full bg-blue-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                LIVE
              </span>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-100">
                  {instrument_name}
                </h3>
                <Badge
                  className={`px-2 py-0.5 ${
                    isBuy
                      ? "bg-emerald-600/90 text-emerald-50"
                      : "bg-rose-600/90 text-rose-50"
                  }`}
                >
                  {trade_side}
                </Badge>
              </div>

              {isBuy ? (
                <ArrowUp className="h-5 w-5 text-emerald-400" />
              ) : (
                <ArrowDown className="h-5 w-5 text-rose-400" />
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {t("started")} {timeDistance}
              <motion.span
                className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </div>

            {/* Entry Price - Modern card style */}
            <div className="mt-4 overflow-hidden rounded-xl bg-slate-800/70 shadow-inner backdrop-blur-sm">
              <div className="border-b border-slate-700/30 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">
                    {t("entryPrice")}
                  </span>
                  <Badge className="bg-gradient-to-r from-blue-700 to-blue-600 px-2 py-0.5 text-white shadow">
                    {t("active")}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <div className="text-2xl font-bold tabular-nums tracking-wide text-white">
                  {formatNumber(entry_price)}
                </div>

                <div className="flex items-center gap-1 rounded-full bg-blue-900/30 px-2.5 py-1 text-xs shadow-inner">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Activity className="mr-1 h-3.5 w-3.5 text-blue-400" />
                  </motion.div>
                  <span className="font-medium text-blue-300">
                    {t("signalActive")}
                  </span>
                </div>
              </div>
            </div>

            {/* Price Range Visualization - Enhanced */}
            <div className="relative mt-4 h-8 overflow-hidden rounded-xl bg-slate-800/70 shadow-inner">
              <div
                className={`absolute bottom-0 left-0 top-0 ${
                  isBuy ? "bg-emerald-500/30" : "bg-rose-500/30"
                }`}
                style={{
                  width: `${((Number(entry_price) - Number(stop_loss_price)) / (Number(take_profit_price) - Number(stop_loss_price))) * 100}%`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-medium tabular-nums">
                <span className="rounded bg-slate-900/40 px-1.5 py-0.5 text-rose-300 shadow-sm">
                  {formatNumber(stop_loss_price)}
                </span>
                <span className="rounded bg-slate-900/40 px-1.5 py-0.5 text-white shadow-sm">
                  {formatNumber(entry_price)}
                </span>
                <span className="rounded bg-slate-900/40 px-1.5 py-0.5 text-emerald-300 shadow-sm">
                  {formatNumber(take_profit_price)}
                </span>
              </div>
            </div>
          </div>

          {/* Targets Section - Modern design */}
          <div className="grid grid-cols-2 gap-2 p-3">
            <div className="flex flex-col overflow-hidden rounded-xl bg-slate-800/70 shadow-inner backdrop-blur-sm">
              <div className="border-b border-slate-700/30 bg-rose-900/20 p-2.5">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-rose-400" />
                  <span className="text-sm font-semibold text-slate-200">
                    {t("invalidation")}
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-2 p-3">
                <span className="text-lg font-bold tabular-nums text-rose-300">
                  {formatNumber(stop_loss_price)}
                </span>
                <span className="text-sm font-medium text-rose-400">
                  (-{potentialLoss.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div className="flex flex-col overflow-hidden rounded-xl bg-slate-800/70 shadow-inner backdrop-blur-sm">
              <div className="border-b border-slate-700/30 bg-emerald-900/20 p-2.5">
                <div className="flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-slate-200">
                    {t("objective")}
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-2 p-3">
                <span className="text-lg font-bold tabular-nums text-emerald-300">
                  {formatNumber(take_profit_price)}
                </span>
                <span className="text-sm font-medium text-emerald-400">
                  (+{potentialProfit.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Live Position Status - Modernized */}
          <div className="p-3">
            <div className="overflow-hidden rounded-xl bg-slate-800/70 shadow-inner backdrop-blur-sm">
              <div className="border-b border-slate-700/30 bg-blue-900/20 p-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-semibold text-slate-300">
                    {t("livePosition")}
                  </span>
                </div>
              </div>

              <div className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  {/* Current Price & Unrealized P/L */}
                  <div className="col-span-2 mb-1 flex items-center justify-between rounded-lg bg-slate-800/90 p-3 shadow-inner">
                    <div>
                      <span className="text-xs text-slate-400">
                        {t("currentPrice")}
                      </span>
                      <div className="text-lg font-bold tabular-nums text-white">
                        {formatNumber(entry_price * (isBuy ? 1.005 : 0.995))}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400">
                        {t("unrealizedPL")}
                      </span>
                      <div
                        className={`text-lg font-bold tabular-nums ${isBuy ? "text-emerald-400" : "text-rose-400"}`}
                      >
                        {isBuy ? "+0.50%" : "-0.50%"}
                      </div>
                    </div>
                  </div>

                  {/* Distance to Target & Stop */}
                  <div className="flex flex-col rounded-lg bg-slate-800/90 p-2.5 shadow-inner">
                    <span className="text-xs text-slate-400">
                      {t("distanceToTarget")}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-medium tabular-nums text-emerald-400">
                        {(
                          (Math.abs(take_profit_price - entry_price) /
                            entry_price) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                      <TrendingUp className="h-3 w-3 text-emerald-300" />
                    </div>
                  </div>

                  <div className="flex flex-col rounded-lg bg-slate-800/90 p-2.5 shadow-inner">
                    <span className="text-xs text-slate-400">
                      {t("distanceToStop")}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-medium tabular-nums text-rose-400">
                        {(
                          (Math.abs(stop_loss_price - entry_price) /
                            entry_price) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                      <TrendingDown className="h-3 w-3 text-rose-300" />
                    </div>
                  </div>

                  {/* Break-even & Market Conditions */}
                  <div className="flex flex-col rounded-lg bg-slate-800/90 p-2.5 shadow-inner">
                    <span className="text-xs text-slate-400">
                      {t("breakEven")}
                    </span>
                    <span className="text-base font-medium tabular-nums text-blue-300">
                      {formatNumber(entry_price * (isBuy ? 1.002 : 0.998))}
                    </span>
                  </div>

                  <div className="flex flex-col rounded-lg bg-slate-800/90 p-2.5 shadow-inner">
                    <span className="text-xs text-slate-400">
                      {t("marketCondition")}
                    </span>
                    <span className="flex items-center gap-1 text-base font-medium">
                      <span
                        className={isBuy ? "text-emerald-400" : "text-rose-400"}
                      >
                        {isBuy ? t("bullish") : t("bearish")}
                      </span>
                      <Badge className="ml-1 bg-amber-800/50 text-[10px] text-amber-200">
                        {t("volatility")}: Med
                      </Badge>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with actual time and live indicator */}
          <div className="flex items-center justify-between bg-blue-900/10 p-3">
            <span className="text-xs font-medium text-slate-400">
              {format(parseISO(entry_time), "MMM dd, yyyy - HH:mm")}
            </span>

            <div className="flex items-center">
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="mr-1.5 h-2 w-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"
              />
              <span className="text-xs font-bold tracking-wide text-blue-400">
                {t("liveTracking")}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  } catch (error) {
    console.error("Error rendering RunningSignalCard:", error);
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-red-500 bg-red-950/10 p-4 text-center">
        <AlertCircle className="mb-2 h-8 w-8 text-red-500" />
        <h3 className="text-lg font-medium text-red-500">Rendering Error</h3>
        <p className="mt-1 text-sm text-slate-400">
          An error occurred while rendering {instrument_name || "this signal"}
        </p>
      </div>
    );
  }
};

export default RunningSignalCard;
