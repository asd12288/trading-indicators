'use client'

import { Signal } from "@/lib/types";
import { format, formatDistance, parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import { XCircle, ArrowUp, ArrowDown, Clock } from "lucide-react";
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
      <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-yellow-500 bg-yellow-950/10 p-3 text-center">
        <XCircle className="h-6 w-6 text-yellow-500" />
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
      maximumFractionDigits: 5,
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
  const percentChange = ((absoluteDiff / entry_price) * 100).toFixed(2);

  return (
    <div className="h-full">
      <div
        className={cn(
          "h-full rounded-lg border shadow-md transition-all hover:shadow-lg",
          theme === "dark" ? "bg-slate-900" : "bg-white",
        )}
      >
        {/* Completed banner */}
        <div
          className={cn(
            "py-1.5 text-center text-sm font-semibold text-white",
            "bg-slate-600", // Neutral color for all fulfilled trades
          )}
        >
          {t("completed")}
        </div>

        <div className="p-4">
          {/* Card header with enhanced title */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3
                className={cn(
                  "text-4xl font-bold", // Increased size from text-lg to text-xl
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

            {/* Softer direction indicator */}
            <div className="mt-2 flex items-center">
              <div
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs",
                  theme === "dark" ? "bg-slate-800" : "bg-slate-100",
                  isBuy ? "text-emerald-400" : "text-rose-400",
                )}
              >
                {isBuy ? "Long" : "Short"}
              </div>

              {/* Small outcome indicator */}
              <div
                className={cn(
                  "ml-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs",
                  theme === "dark" ? "bg-slate-800" : "bg-slate-100",
                  isProfitable ? "text-blue-400" : "text-amber-400",
                )}
              >
                {isProfitable ? "+" : "-"}
                {formatNumber(absoluteDiff)} ({percentChange}%)
              </div>
            </div>
          </div>

          {/* Time information */}
          <div className="mb-4 flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            <span>{format(parseISO(entry_time), "MMM d, HH:mm")}</span>
            <span>•</span>
            <span>{tradeDuration}</span>
          </div>

          {/* Price data in a simpler grid */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div
              className={cn(
                "rounded-lg p-3",
                theme === "dark" ? "bg-slate-800" : "bg-slate-100",
              )}
            >
              <div className="mb-1 text-xs text-slate-400">
                {t("entryPrice")}
              </div>
              <div className="text-xl font-bold">
                {formatNumber(entry_price)}
              </div>
            </div>

            <div
              className={cn(
                "rounded-lg p-3",
                theme === "dark" ? "bg-slate-800" : "bg-slate-100",
              )}
            >
              <div className="mb-1 text-xs text-slate-400">
                {t("exitPrice")}
              </div>
              <div className="text-xl font-bold">
                {formatNumber(exit_price)}
              </div>
            </div>
          </div>

          {/* Simple MFE/MAE display */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div
              className={cn(
                "rounded-lg p-3",
                theme === "dark" ? "bg-emerald-900/20" : "bg-emerald-50",
              )}
            >
              <div className="mb-1 text-xs text-emerald-400">{t("mfe")}</div>
              <div className="text-lg font-bold text-emerald-400">
                {formatNumber(mfe)}
              </div>
            </div>

            <div
              className={cn(
                "rounded-lg p-3",
                theme === "dark" ? "bg-rose-900/20" : "bg-rose-50",
              )}
            >
              <div className="mb-1 text-xs text-rose-400">{t("mae")}</div>
              <div className="text-lg font-bold text-rose-400">
                {formatNumber(mae)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FufilledSignalCard;
