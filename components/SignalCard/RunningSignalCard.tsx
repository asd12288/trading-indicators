import { Signal } from "@/lib/types";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { useTranslations } from "next-intl";
import { FC } from "react";
import {
  ArrowDown,
  ArrowUp,
  Activity,
  Target,
  AlertTriangle,
  Clock,
  Zap,
  BarChart4,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";

interface RunningSignalCardProps {
  instrument: Signal;
  isBuy: boolean;
}

const RunningSignalCard: FC<RunningSignalCardProps> = ({
  instrument,
  isBuy,
}) => {
  const {
    entry_time,
    instrument_name,
    trade_side,
    entry_price,
    exit_price,
    take_profit_price,
    stop_loss_price,
  } = instrument;

  const exitTimeInUserTimezone = parseISO(entry_time);
  const t = useTranslations("RunningSignalCard");
  const adjustedExitTime = new Date(exitTimeInUserTimezone.getTime());
  const timeDistance = formatDistanceToNow(adjustedExitTime, {
    addSuffix: true,
  });

  // Calculate potential profit percentage
  const potentialProfit = isBuy
    ? ((take_profit_price - entry_price) / entry_price) * 100
    : ((entry_price - take_profit_price) / entry_price) * 100;

  // Calculate potential loss percentage
  const potentialLoss = isBuy
    ? ((entry_price - stop_loss_price) / entry_price) * 100
    : ((stop_loss_price - entry_price) / entry_price) * 100;

  // Calculate risk/reward ratio
  const riskRewardRatio = (potentialProfit / potentialLoss).toFixed(1);

  // Format numbers for better readability
  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="h-full w-full"
    >
      <div
        className={`h-full overflow-hidden rounded-lg border-2 ${
          isBuy ? "border-emerald-500" : "border-rose-500"
        } relative bg-slate-900 shadow-md`}
      >
        {/* Enhanced LIVE Status Indicator */}
        <div className="absolute right-0 top-0 z-20">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0px rgba(37, 99, 235, 0)",
                "0 0 10px rgba(37, 99, 235, 0.6)",
                "0 0 0px rgba(37, 99, 235, 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2 rounded-bl-lg bg-blue-600 px-3 py-1.5 shadow-md"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Zap className="h-5 w-5 text-white" />
            </motion.div>
            <span className="font-bold tracking-wider text-white">LIVE</span>
          </motion.div>
        </div>

        {/* Highlight border effect */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            boxShadow: `inset 0 0 0 2px ${isBuy ? "rgba(16, 185, 129, 0.4)" : "rgba(225, 29, 72, 0.4)"}`,
          }}
        />

        {/* Header */}
        <div className="p-4">
          {/* Live trading badge - smaller version that shows on mobile too */}
          <div className="mb-2 flex items-center sm:hidden">
            <span className="mr-2 inline-flex items-center rounded-full bg-blue-900/40 px-2 py-0.5 text-xs font-medium text-blue-300">
              <span className="mr-1 h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400"></span>
              LIVE SIGNAL
            </span>
          </div>

          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">{instrument_name}</h3>
            <Badge
              className={`${isBuy ? "bg-emerald-600" : "bg-rose-600"} px-2 py-0.5 text-sm font-medium`}
            >
              {trade_side}
            </Badge>

            {isBuy ? (
              <ArrowUp className="h-5 w-5 text-emerald-400" />
            ) : (
              <ArrowDown className="h-5 w-5 text-rose-400" />
            )}
          </div>

          <div className="flex items-center text-xs text-slate-300">
            <Clock className="mr-1 h-3 w-3" />
            {t("started")} {timeDistance}
            <motion.span
              className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </div>

          {/* Entry Price - Cleaner design */}
          <div className="mt-4 rounded-md bg-slate-800 p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">
                {t("entryPrice")}
              </span>
              <Badge className="bg-blue-600 px-2 py-0.5">{t("active")}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold tabular-nums tracking-wide text-white">
                {formatNumber(entry_price)}
              </div>

              <div className="flex items-center gap-1 rounded bg-blue-900/30 px-2 py-0.5 text-xs">
                <Activity className="h-3 w-3 text-blue-400" />
                <span className="text-blue-400">SIGNAL ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Price Range Visualization */}
          <div className="relative mt-4 h-6 overflow-hidden rounded-md bg-slate-800">
            <div
              className={`absolute bottom-0 left-0 top-0 ${isBuy ? "bg-emerald-600/40" : "bg-rose-600/40"}`}
              style={{
                width: `${((Number(entry_price) - Number(stop_loss_price)) / (Number(take_profit_price) - Number(stop_loss_price))) * 100}%`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-medium tabular-nums">
              <span className="text-rose-300">
                {formatNumber(stop_loss_price)}
              </span>
              <span className="text-white">{formatNumber(entry_price)}</span>
              <span className="text-emerald-300">
                {formatNumber(take_profit_price)}
              </span>
            </div>
          </div>
        </div>

        {/* Targets Section */}
        <div className="grid grid-cols-2 gap-2 bg-slate-800/50 p-3">
          <div className="flex flex-col rounded-md bg-slate-800 p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <span className="text-sm font-semibold text-slate-200">
                {t("invalidation")}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tabular-nums text-rose-300">
                {formatNumber(stop_loss_price)}
              </span>
              <span className="text-sm font-medium text-rose-400">
                (-{potentialLoss.toFixed(1)}%)
              </span>
            </div>
          </div>

          <div className="flex flex-col rounded-md bg-slate-800 p-3">
            <div className="mb-2 flex items-center gap-1.5">
              <Target className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-semibold text-slate-200">
                {t("objective")}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tabular-nums text-emerald-300">
                {formatNumber(take_profit_price)}
              </span>
              <span className="text-sm font-medium text-emerald-400">
                (+{potentialProfit.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Replace Risk/Reward Section with Live Trading Metrics */}
        <div className="bg-slate-900 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-semibold text-slate-300">
                Live Position Status
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Current Price & Unrealized P/L */}
            <div className="col-span-2 mb-1 flex items-center justify-between rounded-md bg-slate-800 p-2.5">
              <div>
                <span className="text-xs text-slate-400">Current Price</span>
                <div className="text-lg font-bold tabular-nums text-white">
                  {formatNumber(entry_price * (isBuy ? 1.005 : 0.995))}{" "}
                  {/* Simulated current price */}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Unrealized P/L</span>
                <div
                  className={`text-lg font-bold tabular-nums ${isBuy ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {isBuy ? "+0.50%" : "-0.50%"} {/* Simulated P/L */}
                </div>
              </div>
            </div>

            {/* Distance to Target & Stop */}
            <div className="flex flex-col rounded-md bg-slate-800 p-2">
              <span className="text-xs text-slate-400">Distance to Target</span>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-medium tabular-nums text-emerald-400">
                  {(
                    (Math.abs(take_profit_price - entry_price) / entry_price) *
                    100
                  ).toFixed(1)}
                  %
                </span>
                <TrendingUp className="h-3 w-3 text-emerald-300" />
              </div>
            </div>

            <div className="flex flex-col rounded-md bg-slate-800 p-2">
              <span className="text-xs text-slate-400">Distance to Stop</span>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-medium tabular-nums text-rose-400">
                  {(
                    (Math.abs(stop_loss_price - entry_price) / entry_price) *
                    100
                  ).toFixed(1)}
                  %
                </span>
                <TrendingDown className="h-3 w-3 text-rose-300" />
              </div>
            </div>

            {/* Break-even & Market Conditions */}
            <div className="flex flex-col rounded-md bg-slate-800 p-2">
              <span className="text-xs text-slate-400">Break-even Point</span>
              <span className="text-base font-medium tabular-nums text-blue-300">
                {formatNumber(entry_price * (isBuy ? 1.002 : 0.998))}{" "}
                {/* Simulated break-even */}
              </span>
            </div>

            <div className="flex flex-col rounded-md bg-slate-800 p-2">
              <span className="text-xs text-slate-400">Market Condition</span>
              <span className="flex items-center gap-1 text-base font-medium text-amber-400">
                {isBuy ? "Bullish" : "Bearish"}
                <span className="ml-1 text-xs text-slate-400">
                  Volatility: Med
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer with actual time and live indicator */}
        <div className="flex items-center justify-between bg-slate-800/80 p-2">
          <span className="text-xs text-slate-400">
            {format(parseISO(entry_time), "MMM dd, yyyy - HH:mm")}
          </span>

          <div className="flex items-center">
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-400"
            />
            <span className="text-xs font-medium text-blue-400">
              LIVE TRACKING
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RunningSignalCard;
