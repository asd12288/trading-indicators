import { Signal } from "@/lib/types";
import {
  format,
  formatDistance,
  formatDistanceToNow,
  parseISO,
} from "date-fns";
import { useTranslations } from "next-intl";
import {
  CheckCircle,
  Clock,
  ArrowDown,
  ArrowUp,
  TrendingDown,
  TrendingUp,
  Flag,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface FufilledSignalCardProps {
  instrument: Signal;
  isBuy: boolean;
  demo: boolean;
}

const FufilledSignalCard: React.FC<FufilledSignalCardProps> = ({
  instrument,
  isBuy,
  demo = false,
}) => {
  const {
    instrument_name,
    trade_side,
    entry_price,
    exit_price,
    exit_time,
    mae,
    mfe,
    entry_time,
  } = instrument;

  const t = useTranslations("FufilledSignalCard");


  // Early validation for critical fields
  if (!exit_time || !entry_time || !entry_price || !exit_price) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-yellow-500 bg-yellow-950/10 p-4 text-center">
        <AlertCircle className="mb-2 h-8 w-8 text-yellow-500" />
        <h3 className="text-lg font-medium text-yellow-500">Incomplete Data</h3>
        <p className="mt-1 text-sm text-slate-400">
          {instrument_name || "Signal"} is missing required data fields
        </p>
      </div>
    );
  }

  const exitTimeInUserTimezone = parseISO(exit_time);
  const adjustedExitTime = new Date(exitTimeInUserTimezone.getTime());
  const start = parseISO(entry_time);
  const end = parseISO(exit_time);
  const tradeDuration = formatDistance(start, end);

  const timeAgo = formatDistanceToNow(adjustedExitTime, {
    addSuffix: true,
    includeSeconds: true,
  });

  // Calculate profit/loss percentage
  const priceDiff = exit_price - entry_price;
  const pctChange = isBuy
    ? (priceDiff / entry_price) * 100
    : (-priceDiff / entry_price) * 100;
  const isProfitable = isBuy ? priceDiff > 0 : priceDiff < 0;

  // Format numbers for better readability
  const formatNumber = (num) => {
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
        className={`relative h-full overflow-hidden rounded-xl border-2 shadow-lg transition-all hover:shadow-xl ${
          isProfitable
            ? "border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-900"
            : "border-rose-500/30 bg-gradient-to-b from-rose-950/20 to-slate-900"
        }`}
      >
        {/* Status ribbon */}
        <div
          className={`absolute -right-10 top-5 z-10 rotate-45 ${
            isProfitable
              ? "bg-gradient-to-r from-emerald-600 to-emerald-500"
              : "bg-gradient-to-r from-rose-600 to-rose-500"
          } px-10 py-1 shadow-md`}
        >
          <span className="text-xs font-bold tracking-wider text-white">
            COMPLETED
          </span>
        </div>

        {/* Card Header with enhanced styling */}
        <div className="relative p-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-50">
              {instrument_name || "Unknown Instrument"}
            </h3>
            <Badge
              className={cn(
                "px-3 py-1 font-medium shadow-sm",
                isProfitable
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-500"
                  : "bg-gradient-to-r from-rose-600 to-rose-500",
              )}
            >
              {isProfitable ? t("profit") : t("loss")}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <p className="text-xs font-medium text-slate-400">{timeAgo}</p>
            </div>
            <Badge
              variant="outline"
              className="border-slate-600 bg-slate-800/50 text-slate-300 shadow-sm"
            >
              {trade_side}
            </Badge>
          </div>

          {/* Enhanced Result Section with better visual hierarchy */}
          <div className="my-4 overflow-hidden rounded-xl bg-slate-800/60 shadow-inner backdrop-blur-sm">
            <div className="border-b border-slate-700/50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">
                  {t("result")}
                </span>
                <div className="flex items-center gap-1.5 rounded-full bg-slate-700/50 px-2.5 py-0.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-400">
                    {tradeDuration}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-3xl font-bold tabular-nums tracking-tight ${
                      isProfitable ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {pctChange.toFixed(2)}%
                  </span>
                  {isProfitable ? (
                    <TrendingUp className="h-6 w-6 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-rose-400" />
                  )}
                </div>

                <div className="flex items-center rounded-full bg-slate-700/40 px-3 py-1">
                  <Flag
                    className={`mr-1.5 h-4 w-4 ${isProfitable ? "text-emerald-400" : "text-rose-400"}`}
                  />
                  <span
                    className={`text-sm font-medium ${isProfitable ? "text-emerald-300" : "text-rose-300"}`}
                  >
                    {formatNumber(Math.abs(exit_price - entry_price))}{" "}
                    {t("priceDifference")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Data Grid - Modernized */}
        <div className="grid grid-cols-2 gap-1.5 p-3">
          <div className="flex flex-col rounded-xl bg-slate-800/70 p-3 shadow-inner">
            <span className="mb-1 text-xs font-medium text-slate-400">
              {t("entryPrice")}
            </span>
            <span className="text-lg font-semibold tabular-nums tracking-wide text-slate-100">
              {formatNumber(entry_price)}
            </span>
          </div>

          <div className="flex flex-col rounded-xl bg-slate-800/70 p-3 shadow-inner">
            <span className="mb-1 text-xs font-medium text-slate-400">
              {t("exitPrice")}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold tabular-nums tracking-wide text-slate-100">
                {formatNumber(exit_price)}
              </span>
              {isProfitable ? (
                <ArrowUp className="h-4 w-4 text-emerald-400" />
              ) : (
                <ArrowDown className="h-4 w-4 text-rose-400" />
              )}
            </div>
          </div>
        </div>

        {/* MAE/MFE Data with better visualization */}
        <div className="grid grid-cols-2 gap-1.5 p-3 pt-0">
          <div className="flex flex-col rounded-xl bg-slate-800/70 p-3 shadow-inner">
            <span className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-400">
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              {t("mae")}
            </span>
            <span className="text-base font-medium tabular-nums text-rose-300">
              {formatNumber(mae)}
            </span>
          </div>

          <div className="flex flex-col rounded-xl bg-slate-800/70 p-3 shadow-inner">
            <span className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              {t("mfe")}
            </span>
            <span className="text-base font-medium tabular-nums text-emerald-300">
              {formatNumber(mfe)}
            </span>
          </div>
        </div>

        {/* Footer with improved design */}
        <div className="mt-1 flex items-center justify-center border-t border-slate-700/30 bg-slate-800/30 p-3 text-center">
          <CheckCircle className="mr-1.5 h-4 w-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-400">
            {format(parseISO(entry_time), "MMM dd, yyyy - HH:mm")}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default FufilledSignalCard;
