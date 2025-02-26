"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import SignalToolTooltip from "./SignalCard/SignalToolTooltip";

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
      <div className="mb-6 grid grid-cols-2 gap-4 text-slate-200">
        <div>
          <strong>{t("summary.totalTrades")}</strong> {summary.totalTrades}
        </div>
        <div>
          <strong>{t("summary.totalMFETicks")}</strong> {summary.totalMFE}
        </div>
        <div>
          <strong>{t("summary.totalLossTicks")}</strong> {summary.totalLoss}
        </div>
        <div>
          <strong>{t("summary.avgMFETicks")}</strong> {summary.avgMFE}
        </div>
        <div>
          <strong>{t("summary.avgLossTicks")}</strong> {summary.avgLoss}
        </div>
      </div>
      <div className="h-[500px] overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-600">
          <thead className="sticky top-0 bg-slate-700">
            <tr className="ovreflow-x-auto">
              <SignalToolTooltip text={t("tooltips.date")}>
                <th className="px-4 py-2 text-left text-slate-200">
                  {t("table.date")}
                </th>
              </SignalToolTooltip>

              <SignalToolTooltip text={t("tooltips.entryPrice")}>
                <th className="px-4 py-2 text-left text-slate-200">
                  {t("table.entryPrice")}
                </th>
              </SignalToolTooltip>

              <SignalToolTooltip text={t("tooltips.exitPrice")}>
                <th className="px-4 py-2 text-left text-slate-200">
                  {t("table.exitPrice")}
                </th>
              </SignalToolTooltip>

              <SignalToolTooltip text={t("tooltips.tradeSide")}>
                <th className="px-4 py-2 text-left text-slate-200">
                  {t("table.tradeSide")}
                </th>
              </SignalToolTooltip>

              <SignalToolTooltip text={t("tooltips.duration")}>
                <th className="px-4 py-2 text-left text-slate-200">
                  {t("table.duration")}
                </th>
              </SignalToolTooltip>

              <SignalToolTooltip text={t("tooltips.mfeTicks")}>
                <th className="px-4 py-2 text-left text-slate-200">
                  {t("table.mfeTicks")}
                </th>
              </SignalToolTooltip>

              <SignalToolTooltip text={t("tooltips.lossTicks")}>
                <th className="px-4 py-2 text-left text-slate-200">
                  {t("table.lossTicks")}
                </th>
              </SignalToolTooltip>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 bg-slate-800">
            {tableData.map((trade, index) => (
              <tr key={index}>
                <td className="px-4 py-2 text-slate-200">
                  {format(new Date(trade.entry_time), "dd/MM")}
                </td>
                <td className="px-4 py-2 text-slate-200">
                  {trade.entry_price}
                </td>
                <td className="px-4 py-2 text-slate-200">{trade.exit_price}</td>
                <td className="px-4 py-2 capitalize text-slate-200">
                  {trade.trade_side}
                </td>
                <td className="px-4 py-2 text-slate-200">
                  {trade.trade_duration}
                </td>
                <td
                  className={`px-4 py-2 ${
                    trade.mfeTicks > 0 ? "text-green-400" : "text-slate-200"
                  }`}
                >
                  {trade.mfeTicks > 0 ? trade.mfeTicks : "-"}
                </td>
                <td
                  className={`px-4 py-2 ${
                    trade.lossTicks > 0 ? "text-red-400" : "text-slate-200"
                  }`}
                >
                  {trade.lossTicks > 0 ? trade.lossTicks : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceTableWithMFEAndLossTicks;
