import { Signal } from "@/lib/types";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import { FC, memo } from "react";
import {
  Clock,
  Target,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Zap,
  Flag,
  Timer,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RunningSignalCardProps {
  instrument: Signal;
  isBuy: boolean;
}

const RunningSignalCard: FC<RunningSignalCardProps> = memo(
  ({ instrument, isBuy }) => {
    const {
      entry_time,
      instrument_name,
      trade_side,
      entry_price,
      take_profit_price,
      stop_loss_price,
    } = instrument;

    const t = useTranslations("RunningSignalCard");

    if (!entry_time || !entry_price || !take_profit_price || !stop_loss_price) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-yellow-500 bg-yellow-950/10 p-4 text-center">
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

    const formattedTime = format(parseISO(entry_time), "HH:mm:ss");
    const formattedDate = format(parseISO(entry_time), "MMM dd");

    // Calculate risk/reward ratio
    const riskValue = Math.abs(entry_price - stop_loss_price);
    const rewardValue = Math.abs(take_profit_price - entry_price);
    const riskRewardRatio = (rewardValue / riskValue).toFixed(1);

    // Calculate distance to targets in percentage
    const distanceToTP = (
      (Math.abs(take_profit_price - entry_price) / entry_price) *
      100
    ).toFixed(2);
    const distanceToSL = (
      (Math.abs(stop_loss_price - entry_price) / entry_price) *
      100
    ).toFixed(2);

    // Where on the scale between SL and TP is the entry price
    const entryPosition =
      ((entry_price - stop_loss_price) /
        (take_profit_price - stop_loss_price)) *
      100;

    return (
      <div className="h-full">
        <div
          className={cn(
            "relative h-full rounded-lg border-l-4 bg-slate-900 shadow-md transition-all hover:shadow-lg",
            isBuy ? "border-l-emerald-500" : "border-l-rose-500",
          )}
        >
          {/* Live indicator */}
          <div className="absolute right-3 top-3">
            <motion.div
              className="flex items-center gap-1.5 rounded-full bg-blue-600/90 px-2 py-0.5 text-xs shadow-md"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap className="h-3 w-3 text-white" />
              <span className="font-semibold text-white">{t("live")}</span>
            </motion.div>
          </div>

          {/* Card header with better time display */}
          <div className="p-4">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">
                {instrument_name}
              </h3>
              <Badge
                className={cn(
                  "text-xs font-medium",
                  isBuy
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700",
                )}
              >
                {trade_side}
              </Badge>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                <span>{timeAgo}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                <Timer className="h-3 w-3" />
                <span>{formattedTime}</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">{formattedDate}</span>
              </div>
            </div>

            {/* Entry price */}
            <div className="mb-4 flex items-baseline justify-between rounded-md bg-slate-800 p-2">
              <span className="text-sm text-slate-300">{t("entryPrice")}</span>
              <span className="text-lg font-bold text-white">
                {formatNumber(entry_price)}
              </span>
            </div>

            {/* Targets Section - Enhanced */}
            <div className="mb-4 space-y-3">
              {/* Objective/Take Profit */}
              <div className="flex items-center justify-between rounded-md bg-emerald-900/20 p-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-300">
                    {t("objective")}
                  </span>
                </div>
                <div>
                  <div className="text-right text-lg font-bold text-emerald-400">
                    {formatNumber(take_profit_price)}
                  </div>
                  <div className="text-right text-xs text-emerald-500/70">
                    +{distanceToTP}%
                  </div>
                </div>
              </div>

              {/* Stop Loss */}
              <div className="flex items-center justify-between rounded-md bg-rose-900/20 p-2">
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-rose-400" />
                  <span className="text-sm font-medium text-rose-300">
                    {t("stopLoss")}
                  </span>
                </div>
                <div>
                  <div className="text-right text-lg font-bold text-rose-400">
                    {formatNumber(stop_loss_price)}
                  </div>
                  <div className="text-right text-xs text-rose-500/70">
                    -{distanceToSL}%
                  </div>
                </div>
              </div>
            </div>

            {/* Price scale visualization */}
            <div className="mb-3">
              <div className="relative h-6 rounded-lg bg-slate-800 p-1">
                {/* Trade direction indicator */}
                <div
                  className={cn(
                    "absolute top-1 h-4",
                    isBuy
                      ? "bg-gradient-to-r from-transparent to-emerald-500/30"
                      : "bg-gradient-to-l from-transparent to-rose-500/30",
                  )}
                  style={{
                    left: isBuy ? `${entryPosition}%` : "auto",
                    right: isBuy ? "auto" : `${100 - entryPosition}%`,
                    width: `${100 - entryPosition}%`,
                  }}
                ></div>

                {/* Stop, Entry and Target markers */}
                <div className="absolute bottom-0 left-0 top-0 flex items-center">
                  <div className="h-5 w-1 rounded-sm bg-rose-500"></div>
                </div>
                <div
                  className="absolute bottom-0 top-0 flex items-center"
                  style={{ left: `${entryPosition}%` }}
                >
                  <div className="h-5 w-1 rounded-sm bg-blue-500"></div>
                </div>
                <div className="absolute bottom-0 right-0 top-0 flex items-center">
                  <div className="h-5 w-1 rounded-sm bg-emerald-500"></div>
                </div>
              </div>
              <div className="mt-1 flex justify-between text-xs">
                <span className="text-rose-400">{t("stop")}</span>
                <span className="text-blue-400">{t("entry")}</span>
                <span className="text-emerald-400">{t("target")}</span>
              </div>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-2 border-t border-slate-800 p-3">
            <div className="flex flex-col rounded-md bg-slate-800 p-2">
              <span className="text-xs text-slate-400">{t("riskReward")}</span>
              <span className="text-lg font-bold text-white">
                1:{riskRewardRatio}
              </span>
            </div>

            <div className="flex flex-col rounded-md bg-slate-800 p-2">
              <span className="text-xs text-slate-400">{t("direction")}</span>
              <div className="flex items-center">
                {isBuy ? (
                  <>
                    <ArrowUp className="mr-1 h-4 w-4 text-emerald-400" />
                    <span className="font-bold text-emerald-400">
                      {t("long")}
                    </span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="mr-1 h-4 w-4 text-rose-400" />
                    <span className="font-bold text-rose-400">
                      {t("short")}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default RunningSignalCard;
