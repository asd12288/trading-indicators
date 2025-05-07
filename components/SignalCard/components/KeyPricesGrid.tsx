import { useTheme } from "@/context/theme-context";
import { cn, formatNumber } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { FC, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface KeyPricesGridProps {
  instrumentName: string;
  entryPrice: number;
  takeProfitPrice: number;
  stopLossPrice: number;
  profitTargetPercent: string;
  stopLossPercent: string;
}

const KeyPricesGrid: FC<KeyPricesGridProps> = ({
  instrumentName,
  entryPrice,
  takeProfitPrice,
  stopLossPrice,
  profitTargetPercent,
  stopLossPercent,
}) => {
  const { theme } = useTheme();
  const t = useTranslations("RunningSignalCard");

  // refs to track previous prices
  const prevEntryRef = useRef(entryPrice);
  const prevTargetRef = useRef(takeProfitPrice);
  const prevStopRef = useRef(stopLossPrice);

  // toast on price updates
  useEffect(() => {
    if (prevEntryRef.current !== entryPrice) {
      toast(`${instrumentName}: entry price updated to ${entryPrice}`);
      new Audio("/audio/notification.mp3").play();
      prevEntryRef.current = entryPrice;
    }
    if (prevTargetRef.current !== takeProfitPrice) {
      toast(`${instrumentName}: target price updated to ${takeProfitPrice}`);
      new Audio("/audio/notification.mp3").play();

      prevTargetRef.current = takeProfitPrice;
    }
    if (prevStopRef.current !== stopLossPrice) {
      toast(`${instrumentName}: stop loss price updated to ${stopLossPrice}`);
      new Audio("/audio/notification.mp3").play();

      prevStopRef.current = stopLossPrice;
    }
  }, [instrumentName, entryPrice, takeProfitPrice, stopLossPrice]);

  return (
    <div className="mb-5 grid grid-cols-3 gap-2">
      {/* Entry Price */}
      <div
        className={cn(
          "rounded-md p-2",
          theme === "dark" ? "bg-slate-800" : "bg-slate-100",
        )}
      >
        <div className="text-xs text-blue-500">{t("entry")}</div>
        <motion.div
          key={entryPrice}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="font-medium"
        >
          {formatNumber(entryPrice)}
        </motion.div>
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
        <motion.div
          key={takeProfitPrice}
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="font-medium"
        >
          {formatNumber(takeProfitPrice)}
        </motion.div>
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
        <motion.div
          key={stopLossPrice}
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="font-medium"
        >
          {formatNumber(stopLossPrice)}
        </motion.div>
      </div>
    </div>
  );
};

export default KeyPricesGrid;
