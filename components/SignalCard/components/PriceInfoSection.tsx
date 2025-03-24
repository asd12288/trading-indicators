import { useTheme } from "@/context/theme-context";
import { cn, formatNumber } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
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
        "mb-4 grid grid-cols-3 gap-1 overflow-hidden rounded-lg",
        theme === "dark" ? "bg-slate-800/70" : "bg-slate-50",
      )}
    >
      {/* Column 1: Current Price - Simplified */}
      <div
        className={cn(
          "flex flex-col items-center justify-center border-r px-2 py-3",
          theme === "dark" ? "border-slate-700/40" : "border-slate-200",
        )}
      >
        <div className="mb-1 text-xs text-slate-400">{t("currentPrice")}</div>
        <div className="text-2xl font-bold">
          {isLoading ? "..." : formatNumber(currentPrice || entryPrice)}
        </div>
        <div className="mt-1 h-1 w-full rounded-full bg-amber-500"></div>
      </div>

      {/* Column 2: Market Pulse - Only the line graph */}
      <div
        className={cn(
          "border-r px-2 py-3",
          theme === "dark" ? "border-slate-700/40" : "border-slate-200",
        )}
      >
        <div className="mb-2 text-center text-xs text-slate-400">
          Market Pulse
        </div>
        <div className="flex items-center justify-center">
          {/* Pass clean props to hide everything except the graph line */}
          <LastPriceDisplay
            instrumentName={instrumentName}
            size="small"
            showLabel={false}
            showSparkline={true}
            className="market-pulse-only"
            hideChartDetails={true}
          />
        </div>
      </div>

      {/* Column 3: PnL Information - Smaller */}
      <div className="flex flex-col items-center justify-center px-2 py-3">
        <div className="mb-1 text-xs text-slate-400">PnL</div>

        {currentPnL && currentPrice !== entryPrice ? (
          <div className="flex flex-col items-center">
            {/* PnL Amount - Compact */}
            <div
              className={cn(
                "flex items-center text-xs font-semibold",
                isProfitable ? "text-emerald-400" : "text-rose-400",
              )}
            >
              {isProfitable ? (
                <ArrowUp className="mr-0.5 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-0.5 h-3 w-3" />
              )}
              {formatNumber(Math.abs(currentPnL))} {unit}
            </div>

            {/* Percentage - Smaller */}
            <div
              className={cn(
                "text-xs",
                isProfitable ? "text-emerald-400" : "text-rose-400",
              )}
            >
              {isProfitable ? "+" : "-"}
              {pnlPercentage}%
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400">No change</div>
        )}
      </div>
    </div>
  );
};

export default PriceInfoSection;
