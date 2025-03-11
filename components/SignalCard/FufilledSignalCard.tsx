"use client";

import { Signal } from "@/lib/types";
import { format, formatDistance, parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import {
  ArrowUp,
  ArrowDown,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/theme-context";
import useInstrumentInfo from "@/hooks/useInstrumentInfo";

interface FufilledSignalCardProps {
  instrument: Signal;
  isBuy: boolean;
}

const FufilledSignalCard: React.FC<FufilledSignalCardProps> = ({
  instrument,
  isBuy,
}) => {
  const { theme } = useTheme();
  const {
    instrument_name,
    trade_side,
    entry_price,
    exit_price,
    entry_time,
    exit_time,
    mae,
    mfe,
  } = instrument;

  // Get instrument information
  const { instrumentInfo } = useInstrumentInfo(instrument_name);

  const t = useTranslations("FufilledSignalCard");

  // Early validation
  if (!exit_time || !entry_time || !entry_price || !exit_price) {
    return (
      <div className="flex h-[500px] w-full flex-col items-center justify-center rounded-lg border border-yellow-500 bg-yellow-950/10 p-3 text-center">
        <Clock className="h-6 w-6 text-yellow-500" />
        <p className="mt-1 text-xs text-slate-400">
          Incomplete data for {instrument_name}
        </p>
      </div>
    );
  }

  // Format numbers consistently
  const formatNumber = (num) => {
    if (num === null || num === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 9,
    }).format(num);
  };

  // Process data
  const start = parseISO(entry_time);
  const end = parseISO(exit_time);
  const tradeDuration = formatDistance(start, end, { includeSeconds: true });

  // Calculate profit/loss
  const priceDiff = exit_price - entry_price;
  const isProfitable = isBuy ? priceDiff > 0 : priceDiff < 0;
  const absoluteDiff = Math.abs(priceDiff);

  // Calculate MFE (Maximum Favorable Excursion)
  const mfePrice =
    mfe ||
    (isBuy
      ? Math.max(exit_price, entry_price * 1.05)
      : Math.min(exit_price, entry_price * 0.95));
  const mfeDiff = isBuy ? mfePrice - entry_price : entry_price - mfePrice;

  // Calculate MAE (Maximum Adverse Excursion)
  const maePrice =
    mae ||
    (isBuy
      ? Math.min(exit_price, entry_price * 0.95)
      : Math.max(exit_price, entry_price * 1.05));
  const maeDiff = isBuy ? entry_price - maePrice : maePrice - entry_price;

  return (
    <div className="h-full">
      <div
        className={cn(
          "overflow-hidden rounded-lg border shadow-md transition-all hover:shadow-lg",
          isProfitable ? "border-slate-500" : "border-slate-500",
          theme === "dark" ? "bg-slate-900" : "bg-white",
        )}
      >
        {/* Completed banner */}
        <div
          className={cn(
            "py-1.5 text-center text-sm font-semibold text-white",
            "bg-slate-600", // Neutral color for completed trades
          )}
        >
          {t("tradeOver", { defaultValue: "Trade Completed" })}
        </div>

        <div className="flex h-full flex-col p-4">
          {/* Card header with enhanced title */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3
                className={cn(
                  "text-4xl font-bold",
                  theme === "dark" ? "text-white" : "text-slate-900",
                )}
              >
                {instrument_name}
              </h3>
            </div>

            {/* Full instrument name display */}
            {instrumentInfo && (
              <div className="mt-1 text-sm text-slate-400">
                {instrumentInfo.full_name || ""}
              </div>
            )}
          </div>

          {/* Direction and Duration */}
          <div className="mb-4 flex items-center justify-between">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5",
                isBuy
                  ? "bg-emerald-900/20 text-emerald-400"
                  : "bg-rose-900/20 text-rose-400",
              )}
            >
              {isBuy ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
              <span className="font-medium">
                {isBuy
                  ? t("long", { defaultValue: "Long" })
                  : t("short", { defaultValue: "Short" })}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <Clock className="h-4 w-4" />
              <span>{tradeDuration}</span>
            </div>
          </div>

          {/* MFE - Maximum Favorable Excursion - Highlighted as the main metric */}
          <div
            className={cn(
              "mb-4 flex flex-col items-center justify-center rounded-lg border p-4",
              "border-blue-500/20 bg-blue-900/10",
            )}
          >
            <div className="flex items-center gap-1 text-lg font-medium text-blue-300">
              <TrendingUp className="h-5 w-5" />
              {t("maxPotential", { defaultValue: "Maximum Potential" })}
            </div>
            <div className="text-4xl font-bold text-blue-400">
              {formatNumber(Math.abs(mfeDiff))}
            </div>
            <div className="mt-1 text-sm text-slate-400">
              {isBuy ? "Above" : "Below"} entry price
            </div>
          </div>

          {/* MAE and Actual Result in a grid */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            {/* MAE (Maximum Adverse Excursion) */}
            <div
              className={cn(
                "rounded-lg border p-3",
                "border-red-500/20 bg-red-900/10",
              )}
            >
              <div className="mb-1 flex items-center gap-1 text-xs text-red-300">
                <TrendingDown className="h-3.5 w-3.5" />
                {t("maxDrawdown", { defaultValue: "Max Drawdown" })}
              </div>
              <div className="text-lg font-bold text-red-400">
                {formatNumber(Math.abs(maeDiff))}
              </div>
            </div>

            {/* Actual Result */}
            <div
              className={cn(
                "rounded-lg border p-3",
                isProfitable
                  ? "border-emerald-500/20 bg-emerald-900/10"
                  : "border-rose-500/20 bg-rose-900/10",
              )}
            >
              <div className="mb-1 text-xs text-slate-400">
                {t("result", { defaultValue: "Actual Result" })}
              </div>
              <div
                className={cn(
                  "text-lg font-bold",
                  isProfitable ? "text-emerald-400" : "text-rose-400",
                )}
              >
                {isProfitable ? "+" : "-"}
                {formatNumber(absoluteDiff)}
              </div>
            </div>
          </div>

          {/* Entry and Exit */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={cn(
                "rounded-lg p-3",
                theme === "dark" ? "bg-slate-800" : "bg-slate-100",
              )}
            >
              <div className="mb-1 text-xs text-slate-400">
                {t("entry", { defaultValue: "Entry" })}
              </div>
              <div className="text-lg font-semibold">
                {formatNumber(entry_price)}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {format(parseISO(entry_time), "MMM d, HH:mm")}
              </div>
            </div>

            <div
              className={cn(
                "rounded-lg p-3",
                theme === "dark" ? "bg-slate-800" : "bg-slate-100",
              )}
            >
              <div className="mb-1 text-xs text-slate-400">
                {t("close", { defaultValue: "Close" })}
              </div>
              <div className="text-lg font-semibold">
                {formatNumber(exit_price)}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {format(parseISO(exit_time), "MMM d, HH:mm")}
              </div>
            </div>
          </div>

          {/* Future Trade Hint - at bottom */}
          <div className="mt-auto flex items-center justify-center pt-4 text-sm text-slate-400">
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>
              {t("tradingOpportunity", {
                defaultValue: "More opportunities coming soon",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FufilledSignalCard;
