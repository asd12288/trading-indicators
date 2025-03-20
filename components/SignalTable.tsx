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

const SignalTable = ({ allSignal }) => {
  const t = useTranslations("SignalTable");
  const [tableData, setTableData] = useState([]);
  const [summary, setSummary] = useState({
    totalTrades: 0,
    totalMFE: 0,
    totalLoss: 0,
    avgMFE: 0,
    avgLoss: 0,
  });

  useEffect(() => {
    if (!allSignal || !allSignal.length) return;

    const formattedData = allSignal.map((trade) => {
      const entryPrice = Number(trade.entry_price);
      const exitPrice = Number(trade.exit_price);
      const resultTicks = Number(trade.result_ticks);

      // Use the actual mfe value from the database
      const mfeTicks = Number(trade.mfe || 0);

      // Calculate loss ticks from result_ticks if negative
      const lossTicks = resultTicks < 0 ? Math.abs(resultTicks) : 0;

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

      return {
        ...trade,
        entry_price: entryPrice,
        exit_price: exitPrice,
        mfeTicks: Number(mfeTicks.toFixed(2)),
        lossTicks: Number(lossTicks.toFixed(2)),
        trade_duration: tradeDuration,
        isForex,
        measurementUnit,
      };
    });

    const totalTrades = formattedData.length;
    const totalMFE = formattedData.reduce(
      (acc, trade) => acc + trade.mfeTicks,
      0,
    );
    const totalLoss = formattedData.reduce(
      (acc, trade) => acc + trade.lossTicks,
      0,
    );
    const avgMFE = totalTrades ? totalMFE / totalTrades : 0;
    const avgLoss = totalTrades ? totalLoss / totalTrades : 0;

    setTableData(formattedData);
    setSummary({
      totalTrades,
      totalMFE: Number(totalMFE.toFixed(2)),
      totalLoss: Number(totalLoss.toFixed(2)),
      avgMFE: Number(avgMFE.toFixed(2)),
      avgLoss: Number(avgLoss.toFixed(2)),
    });
  }, [allSignal]);

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
            <p className="text-slate-400">
              Analyze trade performance metrics and trends
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label={t("summary.totalTrades")}
          value={summary.totalTrades}
          icon={<BarChart3 className="h-5 w-5 text-blue-400" />}
          color="bg-slate-800"
          tooltip="Total number of completed trades in the dataset"
        />
        <StatCard
          label={t("summary.totalMFETicks")}
          value={summary.totalMFE}
          icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
          color="bg-slate-800"
          tooltip="Sum of all Maximum Favorable Excursion ticks across all trades"
        />
        <StatCard
          label={t("summary.totalLossTicks")}
          value={summary.totalLoss}
          icon={<TrendingDown className="h-5 w-5 text-rose-400" />}
          color="bg-slate-800"
          tooltip="Sum of all negative movement ticks across all trades"
        />
        <StatCard
          label={t("summary.avgMFETicks")}
          value={summary.avgMFE}
          icon={<TrendingUp className="h-5 w-5 text-emerald-400" />}
          color="bg-slate-800"
          tooltip="Average Maximum Favorable Excursion ticks per trade"
        />
        <StatCard
          label={t("summary.avgLossTicks")}
          value={summary.avgLoss}
          icon={<TrendingDown className="h-5 w-5 text-rose-400" />}
          color="bg-slate-800"
          tooltip="Average negative movement ticks per trade"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/80 shadow-lg">
        <div className="min-h-[550px] overflow-x-auto p-4">
          <DataTableTrades data={tableData} columns={tradeSummaryColumns} />
        </div>
      </div>
    </motion.div>
  );
};

export default SignalTable;
