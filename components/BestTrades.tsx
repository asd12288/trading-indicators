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
  RefreshCw,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { FC, useMemo, useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Link } from "@/i18n/routing";

interface BestTradesProps {
  userId?: string;
}

const BestTrades: FC<BestTradesProps> = () => {
  const t = useTranslations("BestTrades");
  // Use allSignals=true to get all trades, not just the latest per instrument
  const { signals } = useSignals({}, true);
  // Keep track of last update time for refreshing
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Set up auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        setLastUpdate(new Date());
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Always show 5 trades, prioritizing high-value trades ($150+)
  const topTrades = useMemo(() => {
    if (!signals || signals.length === 0) return [];

    // Step 1: Calculate dollar value for each signal with positive MFE
    const tradesWithDollarValue = signals
      .filter((signal) => signal.mfe > 0)
      .map((signal) => {
        // Get approximate dollar value based on tick value
        let dollarValue = 0;
        // Use a default multiplier of 10 for cases where we don't have the info
        const defaultTickValue = 10;

        if (signal.tick_value) {
          const valueMatch = String(signal.tick_value).match(
            /\$?(\d+(?:\.\d+)?)/,
          );
          if (valueMatch) {
            dollarValue = Math.round(signal.mfe * parseFloat(valueMatch[1]));
          } else {
            dollarValue = Math.round(signal.mfe * defaultTickValue);
          }
        } else {
          dollarValue = Math.round(signal.mfe * defaultTickValue);
        }

        return {
          ...signal,
          dollarValue,
        };
      });

    // Step 2: Separate high-value trades ($150+) and regular trades
    const highValueTrades = tradesWithDollarValue
      .filter((trade) => trade.dollarValue >= 150)
      .sort((a, b) => b.dollarValue - a.dollarValue);

    // Step 3: If we have 5+ high-value trades, use just those
    if (highValueTrades.length >= 5) {
      return highValueTrades.slice(0, 5);
    }

    // Step 4: Otherwise, add regular trades sorted by recency to fill up to 5 slots
    const regularTrades = tradesWithDollarValue
      .filter((trade) => trade.dollarValue < 150)
      .sort((a, b) => {
        // Sort by entry_time (most recent first)
        if (!a.entry_time) return 1;
        if (!b.entry_time) return -1;
        return (
          new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
        );
      });

    // Combine high-value trades with regular trades to get 5 total
    return [...highValueTrades, ...regularTrades].slice(0, 5);
  }, [signals]);

  if (signals.length === 0) {
    return (
      <div className="flex h-28 items-center justify-center rounded-lg bg-slate-800/50">
        <div className="text-sm text-slate-400">
          {t("loading", { fallback: "Discovering best trades..." })}
        </div>
      </div>
    );
  }

  if (!topTrades.length) {
    return (
      <div className="flex h-28 items-center justify-center rounded-lg bg-slate-800/50">
        <div className="text-sm text-slate-400">
          {t("noData", { fallback: "No trade data available" })}
        </div>
      </div>
    );
  }

  // Count high-value trades for the title
  const highValueCount = topTrades.filter(
    (trade) => (trade.dollarValue || 0) >= 150,
  ).length;

  // Check if we have duplicate instruments
  const instrumentCounts = topTrades.reduce(
    (counts, trade) => {
      counts[trade.instrument_name] = (counts[trade.instrument_name] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-4">
      {/* Header with background */}
      <div className="relative mb-1 flex items-center justify-between rounded-md bg-gradient-to-r from-blue-900/20 to-purple-900/20 px-3 py-2 shadow-inner">
        <div className="flex items-center">
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 shadow-md">
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide text-slate-200">
              {highValueCount > 0
                ? t("title", { fallback: "TOP PROFIT OPPORTUNITIES" })
                : t("title", { fallback: "LATEST TRADING OPPORTUNITIES" })}
            </h3>
            <p className="text-xs text-blue-300">
              {highValueCount > 0
                ? t("subtitle", {
                    fallback: `${highValueCount} trades with $150+ potential`,
                  })
                : t("subtitle", {
                    fallback: "Most recent trading opportunities",
                  })}
            </p>
          </div>
        </div>

        {/* Last update display and refresh button */}
        <div className="flex items-center gap-2">
          <div className="hidden text-xs text-slate-400 sm:block">
            Updated: {format(lastUpdate, "HH:mm")}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {topTrades.map((trade, index) => (
          <TradeCard
            key={`${trade.client_trade_id || trade.id}-${index}`}
            trade={trade}
            rank={index + 1}
            isDuplicate={instrumentCounts[trade.instrument_name] > 1}
          />
        ))}
      </div>
    </div>
  );
};

// Individual trade card component
const TradeCard: FC<{
  trade: Signal & { dollarValue?: number };
  rank: number;
  isDuplicate?: boolean;
}> = ({ trade, rank }) => {
  const { theme } = useTheme();
  const t = useTranslations("BestTrades");
  const isBuy = ["BUY", "LONG", "Buy", "Long"].includes(trade.trade_side);

  // Get instrument category to determine if it's forex (pips) or other (ticks)
  const instrumentCategory = getInstrumentCategory(trade.instrument_name);
  const isForex = instrumentCategory === "forex";
  const measurementUnit = isForex
    ? t("pips", { fallback: "pips" })
    : t("ticks", { fallback: "ticks" });

  // Get instrument info for dollar value calculation
  const { instrumentInfo } = useInstrumentInfo(trade.instrument_name);

  // Use the pre-calculated dollar value or calculate if not available
  let dollarValue = trade.dollarValue || 0;
  let hasCompleteInfo = !!dollarValue;

  if (!dollarValue && instrumentInfo?.tick_value) {
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

  // Determine if this is a high-value trade (for styling)
  const isHighValue = dollarValue >= 150;

  return (
    <Link
      href={`/smart-alerts/${trade.instrument_name}?trade_id=${trade.id || trade.client_trade_id}`}
      className="block h-full"
    >
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-lg border shadow-md transition-all",
          "border-slate-700/70 bg-gradient-to-b from-slate-800 to-slate-900",
          isBuy ? "hover:border-emerald-500/50" : "hover:border-rose-500/50",
          isHighValue && "ring-1 ring-blue-500/30",
        )}
      >
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
              {t(isBuy ? "long" : "short", { fallback: trade.trade_side })}
            </div>
          </div>

          {/* Main metric - dollar value with attractive visual */}
          <div
            className={cn(
              "mb-3 overflow-hidden rounded-md bg-gradient-to-br p-3 shadow-inner",
              isHighValue
                ? "border border-blue-500/30 from-blue-800/40 to-purple-800/40"
                : "from-slate-700/40 to-slate-800/40",
            )}
          >
            <div className="flex items-baseline">
              <DollarSign
                className={cn(
                  "h-6 w-6",
                  isHighValue ? "text-blue-400" : "text-slate-400",
                )}
              />
              <span
                className={cn(
                  "text-2xl font-bold",
                  isHighValue ? "text-blue-300" : "text-slate-300",
                )}
              >
                {dollarValue.toLocaleString()}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span
                className={isHighValue ? "text-blue-400/80" : "text-slate-400"}
              >
                {t("potentialProfit", { fallback: "Potential profit" })}
              </span>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-400" />
                <span className="font-medium text-green-400">
                  {trade.mfe.toFixed(1)} {measurementUnit}
                </span>
              </div>
            </div>
          </div>

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
