import { useTheme } from "@/context/theme-context";
import useForexPrice from "@/hooks/useForexPrice";
import useInstrumentInfo from "@/hooks/useInstrumentInfo";
import { Signal } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, parseISO } from "date-fns";
import { AlertTriangle, ArrowDown, ArrowUp, Clock, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { FC, memo } from "react";
import { Badge } from "../ui/badge";
import LastPriceDisplay from "../LastPriceDisplay";

interface RunningSignalCardProps {
  instrument: Signal;
  isBuy: boolean;
}

const RunningSignalCard: FC<RunningSignalCardProps> = memo(
  ({ instrument, isBuy }) => {
    const { theme } = useTheme();
    const {
      entry_time,
      instrument_name,
      trade_side,
      entry_price,
      take_profit_price,
      stop_loss_price,
    } = instrument;

    // Get real-time last price
    const { lastPrice, isLoading } = useForexPrice(instrument_name);

    // Get instrument information
    const { instrumentInfo, loading: infoLoading } =
      useInstrumentInfo(instrument_name);

    const t = useTranslations("RunningSignalCard");

    if (!entry_time || !entry_price || !take_profit_price || !stop_loss_price) {
      return (
        <div className="flex h-[500px] w-full flex-col items-center justify-center rounded-lg border border-yellow-500 bg-yellow-950/10 p-4 text-center">
          <AlertTriangle className="mb-2 h-6 w-6 text-yellow-500" />
          <p className="text-sm text-slate-400">
            Missing data for {instrument_name || "this signal"}
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

    // Calculate time since entry
    const timeAgo = formatDistanceToNow(parseISO(entry_time), {
      addSuffix: true,
    });

    // Calculate profit/loss based on last price
    const currentPrice = lastPrice?.last || null;
    const currentPnL = currentPrice
      ? isBuy
        ? currentPrice - entry_price
        : entry_price - currentPrice
      : null;
    const isProfitable = currentPnL ? currentPnL > 0 : false;
    const pnlPercentage = currentPnL
      ? ((Math.abs(currentPnL) / entry_price) * 100).toFixed(2)
      : null;

    // Helper function to safely calculate position percentages
    const calculatePosition = (price) => {
      if (!price) return null;

      const range = take_profit_price - stop_loss_price;
      if (range === 0) return 50; // Prevent division by zero

      const position = ((price - stop_loss_price) / range) * 100;
      // Constrain to 0-100% to ensure visibility within the bar
      return Math.min(Math.max(position, 0), 100);
    };

    const entryPosition = calculatePosition(entry_price);
    const currentPosition = calculatePosition(currentPrice);

    // Format the profit target and stop loss as percentages from entry
    const profitTargetPercent = Math.abs(
      ((take_profit_price - entry_price) / entry_price) * 100,
    ).toFixed(1);
    const stopLossPercent = Math.abs(
      ((stop_loss_price - entry_price) / entry_price) * 100,
    ).toFixed(1);

    return (
      <div className="h-full">
        <div
          className={cn(
            "h-full overflow-hidden rounded-lg border shadow-md transition-all hover:shadow-lg",
            isBuy ? "border-emerald-500" : "border-rose-500",
            theme === "dark"
              ? "bg-slate-900"
              : "border border-slate-200 bg-white",
          )}
        >
          <div
            className={cn(
              "py-1.5 text-center text-sm font-semibold text-white",
              isBuy ? "bg-emerald-600" : "bg-rose-600",
            )}
          >
            {t("live")}
          </div>

          <div className="p-4">
            {/* Header with full name */}
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
                <Badge
                  className={cn(
                    "flex items-center gap-1",
                    isBuy
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-rose-600 hover:bg-rose-700",
                  )}
                >
                  {isBuy ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {trade_side}
                </Badge>
              </div>

              {/* Full instrument name display */}
              {instrumentInfo && (
                <div className="mt-1 text-sm text-slate-400">
                  {instrumentInfo.full_name || ""}
                </div>
              )}
            </div>

            {/* Time info */}
            <div className="mb-4 flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{timeAgo}</span>
            </div>

            {/* IMPROVED Current Price Section - More compact and better aligned */}
            <div
              className={cn(
                "mb-4 rounded-lg border-l-4 p-3",
                theme === "dark" ? "bg-slate-800/70" : "bg-slate-50",
                currentPrice
                  ? isProfitable
                    ? "border-l-emerald-500"
                    : "border-l-rose-500"
                  : "border-l-slate-500",
              )}
            >
              {/* Header row with improved alignment */}
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-xs font-medium text-amber-400">
                    {t("currentPrice")}
                  </span>
                  <span className="ml-1 rounded-full bg-blue-500/80 px-1 py-0.5 text-[9px] font-semibold text-white">
                    LIVE
                  </span>
                </div>
                
                {/* Right-aligned performance indicator */}
                {currentPnL && (
                  <div
                    className={cn(
                      "text-xs font-medium",
                      isProfitable ? "text-emerald-400" : "text-rose-400",
                    )}
                  >
                    {isProfitable ? "+" : "-"}
                    {formatNumber(Math.abs(currentPnL))} ({pnlPercentage}%)
                  </div>
                )}
              </div>

              {/* Price and sparkline in a more compact layout */}
              <div className="flex items-start justify-between">
                {/* Price value with larger font */}
                <div className="text-2xl font-bold tracking-tight">
                  {isLoading
                    ? "..."
                    : formatNumber(currentPrice || entry_price)}
                </div>
                
                {/* Sparkline with better sizing */}
                <div className="w-[100px]">
                  <LastPriceDisplay
                    instrumentName={instrument_name}
                    size="small"
                    showLabel={false}
                    showSparkline={true}
                  />
                </div>
              </div>
            </div>

            {/* Key prices in a simple grid */}
            <div className="mb-5 grid grid-cols-3 gap-2">
              {/* Entry Price */}
              <div
                className={cn(
                  "rounded-md p-2",
                  theme === "dark" ? "bg-slate-800" : "bg-slate-100",
                )}
              >
                <div className="text-xs text-slate-400">{t("entry")}</div>
                <div className="font-medium">{formatNumber(entry_price)}</div>
              </div>

              {/* Target Price */}
              <div
                className={cn(
                  "rounded-md p-2",
                  theme === "dark" ? "bg-emerald-900/20" : "bg-emerald-50",
                  theme === "dark" ? "text-emerald-400" : "text-emerald-600",
                )}
              >
                <div className="text-xs opacity-80">{t("target")}</div>
                <div className="font-medium">
                  {formatNumber(take_profit_price)}
                </div>
                <div className="mt-0.5 text-xs opacity-80">
                  +{profitTargetPercent}%
                </div>
              </div>

              {/* Stop Loss */}
              <div
                className={cn(
                  "rounded-md p-2",
                  theme === "dark" ? "bg-rose-900/20" : "bg-rose-50",
                  theme === "dark" ? "text-rose-400" : "text-rose-600",
                )}
              >
                <div className="text-xs opacity-80">{t("stop")}</div>
                <div className="font-medium">
                  {formatNumber(stop_loss_price)}
                </div>
                <div className="mt-0.5 text-xs opacity-80">
                  -{stopLossPercent}%
                </div>
              </div>
            </div>

            {/* Price scale visualization */}
            <div className="mb-5">
              <div className="relative h-8 rounded-lg bg-slate-400 dark:bg-slate-700">
                {/* Progress range for entry price */}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 top-0 opacity-20",
                    isBuy ? "bg-emerald-500" : "bg-rose-600",
                  )}
                  style={{
                    width: `${entryPosition}%`,
                  }}
                />

                {/* Progress from entry to current price (if available) */}
                {currentPosition !== null && (
                  <div
                    className={cn(
                      "absolute bottom-0 top-0 opacity-40",
                      isProfitable ? "bg-emerald-500" : "bg-rose-600",
                    )}
                    style={{
                      left: `${Math.min(entryPosition, currentPosition)}%`,
                      width: `${Math.abs(currentPosition - entryPosition)}%`,
                    }}
                  />
                )}

                {/* Stop Loss marker */}
                <div className="absolute bottom-0 left-0 top-0 flex items-center">
                  <div className="h-8 w-2 rounded-l-lg bg-rose-600" />
                </div>

                {/* Entry price marker */}
                <div
                  className="absolute bottom-0 top-0 z-10 flex items-center"
                  style={{
                    left: `calc(${entryPosition}% - 1.5px)`,
                  }}
                >
                  <div className="h-8 w-3 bg-blue-500" />
                </div>

                {/* Current price marker */}
                {currentPosition !== null && (
                  <div
                    className="absolute bottom-0 top-0 z-20 flex items-center"
                    style={{
                      left: `calc(${currentPosition}% - 1px)`,
                    }}
                  >
                    <div className="h-8 w-2 bg-amber-500" />
                  </div>
                )}

                {/* Take profit marker */}
                <div className="absolute bottom-0 right-0 top-0 flex items-center">
                  <div className="h-8 w-2 rounded-r-lg bg-emerald-600" />
                </div>
              </div>

              {/* Labels for the scale */}
              <div className="mt-1 flex justify-between text-xs">
                <div className="flex flex-col items-start">
                  <span className="font-medium text-rose-500">{t("stop")}</span>
                  <span className="text-slate-400">
                    {formatNumber(stop_loss_price)}
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-medium text-blue-500">
                    {t("entry")}
                  </span>
                  <span className="text-slate-400">
                    {formatNumber(entry_price)}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <span className="font-medium text-emerald-600">
                    {t("target")}
                  </span>
                  <span className="text-slate-400">
                    {formatNumber(take_profit_price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Trade direction */}
            <div
              className={cn(
                "flex items-center justify-center rounded-md py-2",
                isBuy
                  ? "bg-emerald-900/20 text-emerald-400"
                  : "bg-rose-900/20 text-rose-400",
              )}
            >
              {isBuy ? (
                <ArrowUp className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4" />
              )}
              <span className="font-medium">
                {isBuy ? t("long") : t("short")}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

RunningSignalCard.displayName = "RunningSignalCard";

export default RunningSignalCard;
