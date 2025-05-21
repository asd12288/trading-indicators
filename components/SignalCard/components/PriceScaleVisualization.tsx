import { cn, formatNumber } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface PriceScaleVisualizationProps {
  entryPrice: number;
  takeProfitPrice: number;
  stopLossPrice: number;
  currentPosition: number | null;
  entryPosition: number | null;
  isProfitable: boolean;
  isBuy: boolean;
}

const PriceScaleVisualization: FC<PriceScaleVisualizationProps> = ({
  entryPrice,
  takeProfitPrice,
  stopLossPrice,
  currentPosition,
  entryPosition,
  isProfitable,
  isBuy,
}) => {
  const theme = "dark";
  const t = useTranslations("RunningSignalCard");

  // We'll reverse the visual representation for short trades
  // For shorts: Stop is on right (higher price), Target is on left (lower price)
  const targetOnRight = isBuy;
  const stopOnRight = !isBuy;

  return (
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
              left: `${Math.min(entryPosition || 0, currentPosition)}%`,
              width: `${Math.abs((currentPosition || 0) - (entryPosition || 0))}%`,
            }}
          />
        )}

        {/* Left edge marker (stop for longs, target for shorts) */}
        <div className="absolute bottom-0 left-0 top-0 flex items-center">
          <div
            className={cn(
              "h-8 w-2 rounded-l-lg",
              isBuy ? "bg-rose-600" : "bg-emerald-600",
            )}
          />
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

        {/* Right edge marker (target for longs, stop for shorts) */}
        <div className="absolute bottom-0 right-0 top-0 flex items-center">
          <div
            className={cn(
              "h-8 w-2 rounded-r-lg",
              isBuy ? "bg-emerald-600" : "bg-rose-600",
            )}
          />
        </div>
      </div>

      {/* Labels for the scale - Swap positions based on trade direction */}
      <div className="mt-1 flex justify-between text-xs">
        {/* Left label */}
        <div className="flex flex-col items-start">
          {isBuy ? (
            <>
              <span className="font-medium text-rose-500">{t("stop")}</span>
              <span className="text-slate-400">
                {formatNumber(stopLossPrice)}
              </span>
            </>
          ) : (
            <>
              <span className="font-medium text-emerald-600">
                {t("target")}
              </span>
              <span className="text-slate-400">
                {formatNumber(takeProfitPrice)}
              </span>
            </>
          )}
        </div>

        {/* Center label - always entry */}
        <div className="flex flex-col items-center">
          <span className="font-medium text-blue-500">{t("entry")}</span>
          <span className="text-slate-400">{formatNumber(entryPrice)}</span>
        </div>

        {/* Right label */}
        <div className="flex flex-col items-end">
          {isBuy ? (
            <>
              <span className="font-medium text-emerald-600">
                {t("target")}
              </span>
              <span className="text-slate-400">
                {formatNumber(takeProfitPrice)}
              </span>
            </>
          ) : (
            <>
              <span className="font-medium text-rose-500">{t("stop")}</span>
              <span className="text-slate-400">
                {formatNumber(stopLossPrice)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceScaleVisualization;
