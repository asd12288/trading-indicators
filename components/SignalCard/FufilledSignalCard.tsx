"use client";

import { Signal } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import {
  ArrowUp,
  ArrowDown,
  CalendarClock,
  TrendingDown,
  DollarSign,
  InfoIcon,
  RefreshCw,
  Award,
  ShieldAlert,
  ShieldCheck,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/theme-context";
import useInstrumentInfo from "@/hooks/useInstrumentInfo";
import { Badge } from "../ui/badge";

interface FufilledSignalCardProps {
  instrument: Signal;
  isBuy: boolean;
}

const FufilledSignalCard: React.FC<FufilledSignalCardProps> = ({
  instrument,
  isBuy,
}) => {
  const { theme } = useTheme();
  const { instrument_name, trade_side, entry_price, entry_time, mae, mfe } =
    instrument;

  // Get instrument information
  const { instrumentInfo, loading, error } = useInstrumentInfo(instrument_name);

  const hasCompleteInstrumentInfo =
    instrumentInfo &&
    (instrumentInfo.tick_value ||
      (instrumentInfo.contract_size &&
        String(instrumentInfo.contract_size).includes("$")));

  const t = useTranslations("FufilledSignalCard");

  // Early validation
  if (!entry_time || !entry_price) {
    return (
      <div className="flex h-[500px] w-full flex-col items-center justify-center rounded-lg border border-yellow-500 bg-yellow-950/10 p-3 text-center">
        <InfoIcon className="h-6 w-6 text-yellow-500" />
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

  // Format dollar amounts
  const formatDollar = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate MFE in dollar value
  let mfeDollarValue = 0;
  let usingFallbackValues = false;

  // Calculate MFE (Maximum Favorable Excursion)
  const mfeTicks = parseFloat(String(mfe || 0));

  if (instrumentInfo) {
    let tickValue = 1;

    // Parse tick value
    if (instrumentInfo.tick_value) {
      // Handle formats like "≈$10" or "$6.25"
      const valueMatch = String(instrumentInfo.tick_value).match(
        /\$?(\d+(?:\.\d+)?)/,
      );
      if (valueMatch) {
        tickValue = parseFloat(valueMatch[1]);
      } else {
        usingFallbackValues = true;
      }
    } else {
      usingFallbackValues = true;
    }

    // For contracts specified with multiplier like "$5 x Index"
    if (String(instrumentInfo.contract_size || "").includes("$")) {
      const multiplierMatch = String(instrumentInfo.contract_size).match(
        /\$(\d+(?:\.\d+)?)/,
      );
      if (multiplierMatch) {
        const multiplier = parseFloat(multiplierMatch[1]);
        // For index products, calculate based on direct price difference
        const priceDiff = Math.abs(mfeTicks);
        mfeDollarValue = priceDiff * multiplier;
      } else {
        // Standard calculation - MFE is already in ticks
        mfeDollarValue = mfeTicks * tickValue;
        usingFallbackValues = !instrumentInfo.tick_value;
      }
    } else {
      // Standard calculation - MFE is already in ticks
      mfeDollarValue = mfeTicks * tickValue;
      if (!instrumentInfo.tick_value) {
        usingFallbackValues = true;
      }
    }
  } else {
    // No instrument info at all
    usingFallbackValues = true;
    mfeDollarValue = mfeTicks; // Using 1 as multiplier
  }

  // Calculate MAE (Maximum Adverse Excursion)
  const maeTicks = parseFloat(String(mae || 0));

  // Calculate risk/reward ratio for trade quality badge
  const riskRewardRatio = maeTicks > 0 ? mfeTicks / maeTicks : mfeTicks;

  // Determine trade quality based on risk/reward ratio - only show for exceptional trades
  let tradeQuality: {
    label: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
  } | null = null;

  if (riskRewardRatio >= 4) {
    tradeQuality = {
      label: "Expert Trade",
      icon: <Award className="h-3.5 w-3.5" />,
      color: "text-amber-400",
      bgColor: "bg-amber-900/20",
      borderColor: "border-amber-500/40",
    };
  } else if (riskRewardRatio >= 2) {
    tradeQuality = {
      label: "Quality Trade",
      icon: <Star className="h-3.5 w-3.5" />,
      color: "text-emerald-400",
      bgColor: "bg-emerald-900/20",
      borderColor: "border-emerald-500/40",
    };
  }
  // No badge for average or high-risk trades

  return (
    <div className="h-full">
      <div
        className={cn(
          "h-full overflow-hidden rounded-lg border shadow-md transition-all hover:shadow-lg",
          "border-blue-500",
          theme === "dark"
            ? "bg-slate-900"
            : "border border-slate-200 bg-white",
        )}
      >
        {/* Header banner - showing trade is over */}
        <div
          className={cn(
            "py-1.5 text-center text-sm font-semibold text-white",
            "bg-blue-600",
          )}
        >
          {t("tradePotentialOver", { defaultValue: "Trade Potential Over" })}
        </div>

        <div className="flex h-full flex-col p-4">
          {/* Card header with instrument name */}
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <h3
                className={cn(
                  "text-4xl font-bold",
                  theme === "dark" ? "text-white" : "text-slate-900",
                )}
              >
                {instrument_name}
              </h3>

              {/* More subtle direction badge */}
              <div
                className={cn(
                  "flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs",
                  isBuy
                    ? "border-emerald-500/30 bg-emerald-900/10 text-emerald-400"
                    : "border-rose-500/30 bg-rose-900/10 text-rose-400",
                )}
              >
                {isBuy ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {trade_side}
              </div>
            </div>

            {/* Full instrument name display */}
            {instrumentInfo && (
              <div className="mt-1 text-sm text-slate-400">
                {instrumentInfo.full_name || ""}
              </div>
            )}
          </div>

          {/* Trade quality badge - only shown for high quality trades */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {tradeQuality && (
              <div
                className={cn(
                  "flex items-center gap-1 rounded-md border px-2 py-1",
                  tradeQuality.borderColor,
                  tradeQuality.bgColor,
                  tradeQuality.color,
                )}
              >
                {tradeQuality.icon}
                <span className="text-xs font-medium">
                  {tradeQuality.label}
                </span>
                <span className="ml-1 text-xs opacity-80">
                  ({riskRewardRatio.toFixed(1)}x)
                </span>
              </div>
            )}

            {/* Warning badge for limited data */}
            {!hasCompleteInstrumentInfo && (
              <div className="rounded-md bg-amber-900/20 px-2 py-1 text-xs text-amber-400">
                <InfoIcon className="mr-1 inline h-3 w-3" />
                Limited Data
              </div>
            )}
          </div>

          {/* MFE - Maximum Favorable Excursion - Main focus */}
          <div
            className={cn(
              "mb-6 flex flex-col items-center justify-center rounded-lg border p-5",
              "border-blue-500/30 bg-blue-900/10",
              usingFallbackValues && "border-amber-500/30 bg-amber-900/10",
            )}
          >
            <div className="flex items-center gap-1 text-xl font-medium text-blue-300">
              <DollarSign className="h-5 w-5" />
              {t("potentialProfit", { defaultValue: "Potential Profit" })}
              {usingFallbackValues && (
                <span className="ml-1 rounded-md bg-amber-900/40 px-1.5 py-0.5 text-xs text-amber-300">
                  Estimate
                </span>
              )}
            </div>
            <div className="mt-2 text-5xl font-bold text-blue-400">
              {formatDollar(mfeDollarValue)}
            </div>
            <div className="mt-2 text-sm text-slate-400">
              {mfeTicks} ticks maximum potential
              {usingFallbackValues && (
                <span className="ml-1 block text-xs text-amber-400">
                  (Using default multiplier - partial data)
                </span>
              )}
            </div>
          </div>

          {/* Entry and Max Drawdown in a grid */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div
              className={cn(
                "rounded-lg p-4",
                theme === "dark" ? "bg-slate-800" : "bg-slate-100",
              )}
            >
              <div className="mb-2 text-xs text-slate-400">
                {t("entry", { defaultValue: "Entry Price" })}
              </div>
              <div className="text-lg font-semibold">
                {formatNumber(entry_price)}
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                <CalendarClock className="h-3 w-3" />
                {format(parseISO(entry_time), "MMM d, HH:mm")}
              </div>
            </div>

            <div
              className={cn(
                "rounded-lg border p-4",
                "border-red-500/20 bg-red-900/10",
              )}
            >
              <div className="mb-2 flex items-center gap-1 text-xs text-red-300">
                <TrendingDown className="h-3.5 w-3.5" />
                {t("maxDrawdown", { defaultValue: "Max Risk (Drawdown)" })}
              </div>
              <div className="text-lg font-bold text-red-400">
                {maeTicks} ticks
              </div>
              <div className="mt-2 text-xs text-slate-400">
                Maximum adverse movement
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
