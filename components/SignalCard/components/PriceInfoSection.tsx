import { useTheme } from "@/context/theme-context";
import { cn, formatNumber } from "@/lib/utils";
import { ArrowDown, ArrowUp, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { FC } from "react";
import LastPriceDisplay from "../../LastPriceDisplay";

interface PriceInfoSectionProps {
  instrumentName: string;
  isLoading: boolean;
  currentPrice: number | null;
  entryPrice: number;
  currentPnL: number | null;
  isProfitable: boolean;
  pnlPercentage: string | null;
  isForex: boolean;
}

const PriceInfoSection: FC<PriceInfoSectionProps> = ({
  instrumentName,
  isLoading,
  currentPrice,
  entryPrice,
  currentPnL,
  isProfitable,
  pnlPercentage,
  isForex,
}) => {
  const { theme } = useTheme();
  const t = useTranslations("RunningSignalCard");
  
  // Define the unit based on instrument type
  const unit = isForex ? "pips" : "points";

  return (
    <div
      className={cn(
        "mb-4 overflow-hidden rounded-lg border",
        isProfitable ? "border-emerald-500/30" : "border-rose-500/30",
        theme === "dark" ? "bg-slate-800/70" : "bg-slate-50"
      )}
    >
      {/* Simple header with current price label */}
      <div className="flex items-center justify-between border-b border-slate-700/20 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-xs font-medium text-slate-300">
            {t("currentPrice")}
          </span>
        </div>
        
        {/* Entry price reference */}
        <div className="text-xs text-slate-400">
          {t("entry")}: {formatNumber(entryPrice)}
        </div>
      </div>

      {/* Clear price display */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          {/* Current price */}
          <div className="text-2xl font-bold">
            {isLoading ? "..." : formatNumber(currentPrice || entryPrice)}
          </div>

          {/* Price change - compact */}
          {currentPnL && (
            <div className={cn(
              "flex flex-col items-end",
              isProfitable ? "text-emerald-400" : "text-rose-400"
            )}>
              {/* Change amount with arrow */}
              <div className="flex items-center font-medium">
                {isProfitable ? (
                  <ArrowUp className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDown className="mr-1 h-4 w-4" />
                )}
                {formatNumber(Math.abs(currentPnL))} {unit}
              </div>
              
              {/* Percentage */}
              <div className="text-xs">
                {isProfitable ? "+" : "-"}{pnlPercentage}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Price chart */}
      <div className="border-t border-slate-700/20 bg-slate-800/30 px-2 py-1">
        <LastPriceDisplay
          instrumentName={instrumentName}
          size="small"
          showLabel={false}
          showSparkline={true}
        />
      </div>
    </div>
  );
};

export default PriceInfoSection;
