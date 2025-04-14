"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DataTableTrades } from "./DataTableTrades";
import { tradeSummaryColumns } from "./TradesSummaryColmns";
import { motion } from "framer-motion";
import { BarChart3, Info, TrendingUp, TrendingDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { getInstrumentCategory } from "@/lib/instrumentCategories";
import { cn } from "@/lib/utils";

const SignalTable = ({ allSignal, highlightTradeId }) => {
  const t = useTranslations("SignalTable");
  const [tableData, setTableData] = useState([]);
  const [summary, setSummary] = useState({
    totalTrades: 0,
    totalMFE: 0,
    totalMAE: 0, // Changed from totalLoss to totalMAE
    avgMFE: 0,
    avgMAE: 0, // Changed from avgLoss to avgMAE
  });

  useEffect(() => {
    if (!allSignal || !allSignal.length) return;

    const formattedData = allSignal.map((trade) => {
      const entryPrice = Number(trade.entry_price);
      const exitPrice = Number(trade.exit_price);
      const resultTicks = Number(trade.result_ticks);

      // Use the actual mfe value from the database
      const mfeTicks = Number(trade.mfe || 0);

      // Use the actual mae value from the database instead of calculating lossTicks
      const maeTicks = Number(trade.mae || 0);

      // Ensure trade_duration is always positive
      let tradeDuration = trade.trade_duration;
      if (tradeDuration) {
        // Handle case where the entire string starts with a minus
        if (tradeDuration.startsWith("-")) {
          tradeDuration = tradeDuration.replace(/^-\s*/, "");
        }

        // Handle case where individual parts have minus signs (like "1m -46s")
        tradeDuration = tradeDuration.replace(/ -(\d+[hms])/g, " $1");
      }

      // Check if this is a forex instrument
      const instrumentCategory = getInstrumentCategory(trade.instrument_name);
      const isForex = instrumentCategory === "forex";
      const measurementUnit = isForex ? "pips" : "ticks";

      // Check if this trade should be highlighted
      const isHighlighted =
        highlightTradeId &&
        (String(trade.id) === highlightTradeId ||
          String(trade.client_trade_id) === highlightTradeId);

      return {
        ...trade,
        entry_price: entryPrice,
        exit_price: exitPrice,
        mfeTicks: Number(mfeTicks.toFixed(2)),
        maeTicks: Number(maeTicks.toFixed(2)), // Use MAE instead of lossTicks
        trade_duration: tradeDuration,
        isForex,
        measurementUnit,
        isHighlighted, // Add highlight flag
      };
    });

    const totalTrades = formattedData.length;
    const totalMFE = formattedData.reduce(
      (acc, trade) => acc + trade.mfeTicks,
      0,
    );
    const totalMAE = formattedData.reduce(
      (acc, trade) => acc + trade.maeTicks, // Sum MAE instead of lossTicks
      0,
    );
    const avgMFE = totalTrades ? totalMFE / totalTrades : 0;
    const avgMAE = totalTrades ? totalMAE / totalTrades : 0; // Calculate average MAE

    setTableData(formattedData);
    setSummary({
      totalTrades,
      totalMFE: Number(totalMFE.toFixed(2)),
      totalMAE: Number(totalMAE.toFixed(2)), // Store totalMAE
      avgMFE: Number(avgMFE.toFixed(2)),
      avgMAE: Number(avgMAE.toFixed(2)), // Store avgMAE
    });
  }, [allSignal, highlightTradeId]);

  const StatCard = ({ label, value, icon, color, tooltip }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ y: -2 }}
            className={`flex items-center justify-between rounded-lg ${color} p-4 shadow-md`}
          >
            <div>
              <div className="mb-1 flex items-center gap-1">
                <span className="text-sm font-medium text-slate-300">
                  {label}
                </span>
                <Info className="h-3.5 w-3.5 text-slate-400" />
              </div>
              <div className="text-2xl font-bold text-white">{value}</div>
            </div>
            <div className={`rounded-full bg-slate-800/30 p-2 opacity-80`}>
              {icon}
            </div>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm">{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  // Find if we have a highlighted trade and its info
  const highlightedTrade = tableData.find((trade) => trade.isHighlighted);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-900/30 p-3">
            <BarChart3 className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{t("title")}</h2>
            <p className="text-slate-400">{t("subTitle")}</p>
          </div>
        </div>

        {/* Show highlighted trade info if present */}
        {highlightedTrade && (
          <div className="flex items-center rounded-lg border border-blue-500/30 bg-blue-900/20 px-3 py-1">
            <span className="mr-2 text-sm text-blue-400">Selected Trade:</span>
            <span className="font-medium text-blue-300">
              {new Date(highlightedTrade.entry_time).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label={t("summary.totalTrades")}
          value={summary.totalTrades}
          icon={<BarChart3 className="h-5 w-5 text-blue-400" />}
          color="bg-slate-800"
          tooltip={t("toolTips.1")}
        />
        <StatCard
          label={t("summary.totalMFETicks")}
          value={summary.totalMFE}
          icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
          color="bg-slate-800"
          tooltip={t("toolTips.2")}
        />
        <StatCard
          label={t("summary.totalLossTicks")} // Changed label to MAE
          value={summary.totalMAE}
          icon={<TrendingDown className="h-5 w-5 text-rose-400" />}
          color="bg-slate-800"
          tooltip="Sum of all Maximum Adverse Excursion ticks across all trades" // Updated tooltip
        />
        <StatCard
          label={t("summary.avgMFETicks")}
          value={summary.avgMFE}
          icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
          color="bg-slate-800"
          tooltip={t("toolTips.4")}
        />
        <StatCard
          label={t("summary.avgLossTicks")} // Changed label to average MAE
          value={summary.avgMAE}
          icon={<TrendingDown className="h-5 w-5 text-rose-400" />}
          color="bg-slate-800"
          tooltip="Average Maximum Adverse Excursion ticks per trade" // Updated tooltip
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/80 shadow-lg">
        <div className="min-h-[550px] overflow-x-auto p-4">
          <DataTableTrades
            data={tableData}
            columns={tradeSummaryColumns}
            highlightTradeId={highlightTradeId}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SignalTable;
