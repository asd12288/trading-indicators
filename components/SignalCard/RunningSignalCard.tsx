import { useTheme } from "@/context/theme-context";
import useForexPrice from "@/hooks/useForexPrice";
import useInstrumentInfo from "@/hooks/useInstrumentInfo";
import { Signal } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ArrowDown, ArrowUp, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { FC, memo } from "react";
import { Badge } from "../ui/badge";
import { getInstrumentCategory } from "@/lib/instrumentCategories";

// Import the new components
import ErrorCard from "./components/ErrorCard";
import PriceInfoSection from "./components/PriceInfoSection";
import KeyPricesGrid from "./components/KeyPricesGrid";
import PriceScaleVisualization from "./components/PriceScaleVisualization";
import TradeDirectionDisplay from "./components/TradeDirectionDisplay";

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

    // Determine if the instrument is forex to display pips or ticks
    const instrumentCategory = getInstrumentCategory(instrument_name);
    const isForex = instrumentCategory === "forex";

    // Get real-time last price
    const { lastPrice, isLoading } = useForexPrice(instrument_name);

    // Get instrument information
    const { instrumentInfo, loading: infoLoading } =
      useInstrumentInfo(instrument_name);

    const t = useTranslations("RunningSignalCard");

    if (!entry_time || !entry_price || !take_profit_price || !stop_loss_price) {
      return <ErrorCard instrumentName={instrument_name} />;
    }

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

            {/* Trade Direction Display */}
            <TradeDirectionDisplay isBuy={isBuy} />
          </div>
        </div>
      </div>
    );
  },
);

RunningSignalCard.displayName = "RunningSignalCard";

export default RunningSignalCard;
