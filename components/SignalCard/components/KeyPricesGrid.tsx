import { useTheme } from "@/context/theme-context";
import { cn, formatNumber } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface KeyPricesGridProps {
  entryPrice: number;
  takeProfitPrice: number;
  stopLossPrice: number;
  profitTargetPercent: string;
  stopLossPercent: string;
}

const KeyPricesGrid: FC<KeyPricesGridProps> = ({
  entryPrice,
  takeProfitPrice,
  stopLossPrice,
  profitTargetPercent,
  stopLossPercent,
}) => {
  const { theme } = useTheme();
  const t = useTranslations("RunningSignalCard");

  return (
    <div className="mb-5 grid grid-cols-3 gap-2">
      {/* Entry Price */}
      <div
        className={cn(
          "rounded-md p-2",
          theme === "dark" ? "bg-slate-800 text-blue-500" : "bg-slate-100",
        )}
      >
        <div className="text-xs text-blue-500">{t("entry")}</div>
        <div className="font-medium">{formatNumber(entryPrice)}</div>
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
        <div className="font-medium">{formatNumber(takeProfitPrice)}</div>
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
        <div className="font-medium">{formatNumber(stopLossPrice)}</div>
      </div>
    </div>
  );
};

export default KeyPricesGrid;
