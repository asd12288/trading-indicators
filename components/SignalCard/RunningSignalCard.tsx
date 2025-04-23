import { useTheme } from "@/context/theme-context";
import useForexPrice from "@/hooks/useForexPrice";
import useInstrumentInfo from "@/hooks/useInstrumentInfo";
import { getInstrumentCategory } from "@/lib/instrumentCategories";
import { Signal } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ArrowDown, ArrowUp, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { FC, useState } from "react";
import { Badge } from "../ui/badge";

// Import the new components
import KeyPricesGrid from "./components/KeyPricesGrid";
import PriceInfoSection from "./components/PriceInfoSection";
import PriceScaleVisualization from "./components/PriceScaleVisualization";
import SignalLoadingCard from "./SignalLoadingCard";

interface RunningSignalCardProps {
  instrument: Signal;
  isBuy: boolean;
  demo?: boolean; // Add demo prop
}

const RunningSignalCard: FC<RunningSignalCardProps> = ({
  instrument,
  isBuy,
  demo = false,
}) => {
  const { theme } = useTheme();
  const {
    entry_time,
    instrument_name = "eurusd",
    trade_side,
    entry_price,
    take_profit_price,
    stop_loss_price,
  } = instrument;

  // Add state to track chart loading errors
  const [chartLoadFailed, setChartLoadFailed] = useState(false);

  // Determine if the instrument is forex to display pips or ticks
  const instrumentCategory = getInstrumentCategory(instrument_name);
  const isForex = instrumentCategory === "forex";

  // Get real-time last price (skip API call if demo)
  const { lastPrice, isLoading } = useForexPrice(instrument_name);

  // Get instrument information (skip API call if demo)
  const { instrumentInfo, loading: infoLoading } = useInstrumentInfo(
    instrument_name,
    demo,
  );

  const t = useTranslations("RunningSignalCard");

  if (!entry_time || !entry_price || !take_profit_price || !stop_loss_price) {
    // Show loading skeleton while data propagates
    return <SignalLoadingCard />;
  }

  // Calculate time since entry
  const timeAgo = formatDistanceToNow(parseISO(entry_time), {
    addSuffix: true,
  });

  // For demo mode, use fake price data
  const currentPrice = demo
    ? isBuy
      ? entry_price * 1.001 // Slight profit for demo buy
      : entry_price * 0.999 // Slight profit for demo sell
    : lastPrice?.last || null;

  // Calculate profit/loss based on last price
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
    if (Math.abs(range) < 0.00001) return 50; // Prevent division by zero

    // For shorts, we need to invert the position calculation
    // since target is on the left and stop is on the right
    if (isBuy) {
      // Long position: stop is left (0%), target is right (100%)
      const position = ((price - stop_loss_price) / range) * 100;
      return Math.min(Math.max(position, 0), 100);
    } else {
      // Short position: target is left (0%), stop is right (100%)
      const position =
        ((price - take_profit_price) / (stop_loss_price - take_profit_price)) *
        100;
      return Math.min(Math.max(position, 0), 100);
    }
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

  // Handle chart error
  const handleChartError = () => {
    setChartLoadFailed(true);
  };

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
          <div className="mb-4 flex justify-between">
            <div className="flex flex-col gap-2">
              <h3
                className={cn(
                  "text-4xl font-bold",
                  theme === "dark" ? "text-white" : "text-slate-900",
                )}
              >
                {instrument_name}
              </h3>
              {instrumentInfo && (
                <div className="mt-1 text-sm text-slate-400">
                  {instrumentInfo.full_name || ""}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Badge
                className={cn(
                  "flex items-center justify-center gap-1",
                  isBuy
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700",
                )}
              >
                {isBuy ? (
                  <ArrowUp className="h-5 w-5" />
                ) : (
                  <ArrowDown className="h-5 w-5" />
                )}
                <span className="md:text-lg">{trade_side}</span>
              </Badge>
              {/* Time info */}
              <div className="mb-4 flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>

          {/* Price Info Section */}
          <PriceInfoSection
            instrumentName={instrument_name}
            isLoading={isLoading}
            currentPrice={currentPrice}
            entryPrice={entry_price}
            currentPnL={currentPnL}
            isProfitable={isProfitable}
            pnlPercentage={pnlPercentage}
            isForex={isForex}
          />

          {/* Key Prices Grid */}
          <KeyPricesGrid
            entryPrice={entry_price}
            takeProfitPrice={take_profit_price}
            stopLossPrice={stop_loss_price}
            profitTargetPercent={profitTargetPercent}
            stopLossPercent={stopLossPercent}
          />

          {/* Price Scale Visualization */}
          <PriceScaleVisualization
            entryPrice={entry_price}
            takeProfitPrice={take_profit_price}
            stopLossPrice={stop_loss_price}
            currentPosition={currentPosition}
            entryPosition={entryPosition}
            isProfitable={isProfitable}
            isBuy={isBuy}
          />

          {/* TradingView Chart Widget with enhanced error handling */}
          <div className="relative mb-4">
            {/* <TradingViewWidget
              symbol={instrument_name}
              height={180}
              showToolbar={false}
              lightweight={true}
              interval="15"
              isBuy={isBuy}
              demo={demo} // Pass demo flag to prevent real API calls
            /> */}

            {/* Note: Our improved TradingViewWidget component now handles error and loading states internally */}
          </div>
        </div>
      </div>
    </div>
  );
};

RunningSignalCard.displayName = "RunningSignalCard";

export default RunningSignalCard;
