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
} from "lucide-react";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

  if (!exit_time) {
    return null;
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
        className={`h-full overflow-hidden rounded-lg border ${
          isProfitable
            ? "border-emerald-500 bg-emerald-950/10"
            : "border-rose-500 bg-rose-950/10"
        } shadow-sm`}
      >
        {/* Completed Status Indicator */}
        <div className="absolute right-3 top-3 z-10">
          <div className="flex items-center gap-2 rounded-lg bg-slate-700 px-2.5 py-1 shadow-sm">
            <CheckCircle className="h-4 w-4 text-slate-300" />
            <span className="font-medium text-slate-300">COMPLETED</span>
          </div>
        </div>

        {/* Card Header */}
        <div className="relative p-4">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-50">
              {instrument_name}
            </h3>
            <Badge
              className={cn(
                "px-3 py-1 font-medium",
                isProfitable ? "bg-emerald-600" : "bg-rose-600",
              )}
            >
              {isProfitable ? "PROFIT" : "LOSS"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-400">
              {timeAgo} • {t("finished")}
            </p>
            <Badge
              variant="outline"
              className="border-slate-600 text-slate-300"
            >
              {trade_side}
            </Badge>
          </div>

          {/* Enhanced Result Section */}
          <div className="my-3 rounded-md bg-slate-800/80 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">
                {t("result")}
              </span>
              <div className="flex items-center gap-1 text-sm text-slate-300">
                <Clock size={14} />
                <span>{tradeDuration}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-3xl font-bold tabular-nums ${
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
                  className={`mr-1 h-4 w-4 ${isProfitable ? "text-emerald-400" : "text-rose-400"}`}
                />
                <span
                  className={`text-sm font-medium ${isProfitable ? "text-emerald-300" : "text-rose-300"}`}
                >
                  {formatNumber(Math.abs(exit_price - entry_price))}{" "}
                  {isProfitable ? "gain" : "loss"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Data Grid */}
        <div className="grid grid-cols-2 gap-1 bg-slate-900/50 p-2">
          <div className="flex flex-col rounded-md bg-slate-800/70 p-3">
            <span className="text-xs font-medium text-slate-400">
              {t("entryPrice")}
            </span>
            <span className="text-lg font-semibold tabular-nums tracking-wide text-slate-100">
              {formatNumber(entry_price)}
            </span>
          </div>

          <div className="flex flex-col rounded-md bg-slate-800/70 p-3">
            <span className="text-xs font-medium text-slate-400">
              {t("exitPrice")}
            </span>
            <span className="text-lg font-semibold tabular-nums tracking-wide text-slate-100">
              {formatNumber(exit_price)}
            </span>
          </div>
        </div>

        {/* MAE/MFE Data */}
        <div className="grid grid-cols-2 gap-1 bg-slate-900/50 p-2">
          <div className="flex flex-col rounded-md bg-slate-800/70 p-3">
            <span className="text-xs font-medium text-slate-400">
              {t("mae")}
            </span>
            <span className="text-base font-medium tabular-nums text-rose-300">
              {formatNumber(mae)}
            </span>
          </div>

          <div className="flex flex-col rounded-md bg-slate-800/70 p-3">
            <span className="text-xs font-medium text-slate-400">
              {t("mfe")}
            </span>
            <span className="text-base font-medium tabular-nums text-emerald-300">
              {formatNumber(mfe)}
            </span>
          </div>
        </div>

        {/* Footer with improved visual */}
        <div className="bg-slate-800/40 p-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">
              {format(parseISO(entry_time), "MMM dd, yyyy - HH:mm")}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FufilledSignalCard;
