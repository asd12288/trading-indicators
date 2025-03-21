import { useTheme } from "@/context/theme-context";
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
  const t = useTranslations("RunningSignalCard");

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
          <span className="text-slate-400">{formatNumber(stopLossPrice)}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="font-medium text-blue-500">{t("entry")}</span>
          <span className="text-slate-400">{formatNumber(entryPrice)}</span>
        </div>

        <div className="flex flex-col items-end">
          <span className="font-medium text-emerald-600">{t("target")}</span>
          <span className="text-slate-400">
            {formatNumber(takeProfitPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceScaleVisualization;
