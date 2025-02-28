"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { DataTableTrades } from "./DataTableTrades";
import { tradeSummaryColumns } from "./TradesSummaryColmns";

const PerformanceTableWithMFEAndLossTicks = ({ allSignal }) => {
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

      return {
        ...trade,
        entry_price: entryPrice,
        exit_price: exitPrice,
        mfeTicks: Number(mfeTicks.toFixed(2)),
        lossTicks: Number(lossTicks.toFixed(2)),
        trade_duration: tradeDuration,
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

  return (
    <div className="w-full rounded-2xl bg-slate-800 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-slate-100">
        {t("title")}
      </h2>
      
      <div className="min-h-[550px] overflow-x-auto">
        <DataTableTrades data={tableData} columns={tradeSummaryColumns} />
      </div>
    </div>
  );
};

export default PerformanceTableWithMFEAndLossTicks;
