"use client";

import { useTheme } from "@/context/theme-context";
import useInstrumentInfo from "@/hooks/useInstrumentInfo";
import useSignals from "@/hooks/useSignals";
import { getInstrumentCategory } from "@/lib/instrumentCategories";
import { Signal } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  CalendarClock,
  DollarSign,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { FC, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { Link } from "@/i18n/routing";

interface BestTradesProps {
  userId?: string;
}

const BestTrades: FC<BestTradesProps> = ({ userId }) => {
  const { theme } = useTheme();
  const t = useTranslations("BestTrades");
  const { signals, isLoading } = useSignals();

  // Calculate and sort the top 5 trades by MFE (Maximum Favorable Excursion)
  const topTrades = useMemo(() => {
    if (!signals || signals.length === 0) return [];

    // Create a copy and sort by MFE value in descending order
    const sortedSignals = [...signals]
      .filter((signal) => signal.mfe > 0) // Only include signals with positive MFE
      .sort((a, b) => b.mfe - a.mfe)
      .slice(0, 5); // Take top 5

    return sortedSignals;
  }, [signals]);

  if (isLoading) {
    return (
      <div className="flex h-28 items-center justify-center rounded-lg bg-slate-800/50">
        <div className="text-sm text-slate-400">
          {t("loading", { fallback: "Discovering today's best trades..." })}
        </div>
      </div>
    );
  }

  if (!topTrades.length) {
    return (
      <div className="flex h-28 items-center justify-center rounded-lg bg-slate-800/50">
        <div className="text-sm text-slate-400">
          {t("noData", { fallback: "Best trades will appear here soon" })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with background */}
      <div className="relative mb-1 flex items-center rounded-md bg-gradient-to-r from-blue-900/20 to-purple-900/20 px-3 py-2 shadow-inner">
        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 shadow-md">
          <Trophy className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-wide text-slate-200">
            {t("title", { fallback: "TODAY'S BEST OPPORTUNITIES" })}
          </h3>
          <p className="text-xs text-blue-300">
            {t("subtitle", {
              fallback: "Potential profit leaders you can aim for",
            })}
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {topTrades.map((trade, index) => (
          <TradeCard
            key={trade.client_trade_id}
            trade={trade}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

// Individual trade card component
const TradeCard: FC<{ trade: Signal; rank: number }> = ({ trade, rank }) => {
  const { theme } = useTheme();
  const isBuy = ["BUY", "LONG", "Buy", "Long"].includes(trade.trade_side);

  // Get instrument category to determine if it's forex (pips) or other (ticks)
  const instrumentCategory = getInstrumentCategory(trade.instrument_name);
  const isForex = instrumentCategory === "forex";
  const measurementUnit = isForex ? "pips" : "ticks";

  // Get instrument info for dollar value calculation
  const { instrumentInfo } = useInstrumentInfo(trade.instrument_name);

  // Calculate dollar value
  let dollarValue = 0;
  let hasCompleteInfo = false;

  if (instrumentInfo?.tick_value) {
    const valueMatch = String(instrumentInfo.tick_value).match(
      /\$?(\d+(?:\.\d+)?)/,
    );
    if (valueMatch) {
      const tickValue = parseFloat(valueMatch[1]);
      dollarValue = Math.round(trade.mfe * tickValue);
      hasCompleteInfo = true;
    }
  }

  // Format the entry time
  const entryTimeFormatted = trade.entry_time
    ? format(parseISO(trade.entry_time), "HH:mm, MMM d")
    : "";

  // Medal colors and labels
  const medals = [
    { color: "from-amber-400 to-yellow-600", label: "TOP PERFORMER" },
    { color: "from-slate-300 to-slate-500", label: "2ND BEST" },
    { color: "from-amber-700 to-amber-900", label: "3RD BEST" },
    { color: "from-slate-600 to-slate-800", label: "" },
    { color: "from-slate-600 to-slate-800", label: "" },
  ];

  return (
    <Link
      href={`/smart-alerts/${trade.instrument_name}`}
      className="block h-full"
    >
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-lg border shadow-md transition-all",
          "border-slate-700/70 bg-gradient-to-b from-slate-800 to-slate-900",
          isBuy ? "hover:border-emerald-500/50" : "hover:border-rose-500/50",
        )}
      >
        {/* Rank badge - top 3 get special treatment */}
        {/* {rank <= 3 && (
          <div className="absolute left-0 right-0 top-0 z-10 py-1 text-center text-xs font-bold tracking-wider text-white">
            <div
              className={`bg-gradient-to-r ${medals[rank - 1].color} py-0.5 shadow-md`}
            >
              {medals[rank - 1].label}
            </div>
          </div>
        )} */}

        <div className="flex h-full flex-col p-4">
          {/* Top section with rank, instrument and direction */}
          <div className="mb-3 flex items-start justify-between">
            {/* Left - rank and instrument */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                  rank === 1
                    ? "bg-amber-500 text-slate-900"
                    : rank === 2
                      ? "bg-slate-400 text-slate-900"
                      : rank === 3
                        ? "bg-amber-700 text-white"
                        : "bg-slate-700 text-slate-300",
                )}
              >
                {rank}
              </div>
              <div>
                <h4
                  className={cn(
                    "font-bold",
                    rank === 1 ? "text-amber-400" : "text-slate-100",
                  )}
                >
                  {trade.instrument_name}
                </h4>
                {instrumentInfo?.full_name && (
                  <div className="mt-0.5 line-clamp-1 text-xs text-slate-400">
                    {instrumentInfo.full_name}
                  </div>
                )}
              </div>
            </div>

            {/* Right - trade direction */}
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                isBuy
                  ? "border border-emerald-500/30 bg-emerald-900/30 text-emerald-400"
                  : "border border-rose-500/30 bg-rose-900/30 text-rose-400",
              )}
            >
              {isBuy ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {trade.trade_side}
            </div>
          </div>

          {/* Main metric - dollar value with attractive visual */}
          {hasCompleteInfo && (
            <div className="mb-3 overflow-hidden rounded-md bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-3 shadow-inner">
              <div className="flex items-baseline">
                <DollarSign className="h-6 w-6 text-blue-400" />
                <span className="text-2xl font-bold text-blue-300">
                  {dollarValue.toLocaleString()}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="text-blue-400/80">Potential profit</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="font-medium text-green-400">
                    {trade.mfe.toFixed(1)} {measurementUnit}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom section - time info with subtle visual */}
          {entryTimeFormatted && (
            <div className="mt-auto flex items-center gap-1 rounded-sm border border-slate-700/50 bg-slate-800/50 px-2 py-1 text-xs text-slate-400">
              <CalendarClock className="h-3 w-3" />
              <span>{entryTimeFormatted}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BestTrades;
