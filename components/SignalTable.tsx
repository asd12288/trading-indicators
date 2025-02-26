"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { Tooltip } from "./ui/tooltip";
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

  // Rest of your state and effect code remains the same...

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

    // Rest of your calculations remain the same...
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
              <SignalToolTooltip text="The date when the trade was entered. This shows when the position was opened in the format day/month/year.">
                <th className="px-4 py-2 text-left text-slate-200">
                  {t("table.date")}
                </th>
              </SignalToolTooltip>

              <SignalToolTooltip text="The exact price at which the trade position was opened. This is the price level where your position was established in the market.">
                <th className="px-4 py-2 text-left text-slate-200">
                  {t("table.entryPrice")}
                </th>
              </SignalToolTooltip>

              <SignalToolTooltip text="The exact price at which the position was closed. This value is automatically recorded once the trade finishes either by hitting a target, a stop, or manual close.">
                <th className="px-4 py-2 text-left text-slate-200">
                  {t("table.exitPrice")}
                </th>
              </SignalToolTooltip>

              <SignalToolTooltip text="Indicates whether the trade was a Long position (betting on price increase) or Short position (betting on price decrease). This shows the trade direction.">
                <th className="px-4 py-2 text-left text-slate-200">
                  {t("table.tradeSide")}
                </th>
              </SignalToolTooltip>

              <SignalToolTooltip text="How long the position remained open, measured in hours, minutes, or seconds. The app calculates this from the time you entered (Entry Price) to the time you exited (Exit Price).">
                <th className="px-4 py-2 text-left text-slate-200">
                  {t("table.duration")}
                </th>
              </SignalToolTooltip>

              <SignalToolTooltip text="MFE (Maximum Favorable Excursion) tracks the biggest unrealized gain achieved during a trade before it was closed. If your trade was 'in profit' by 10 ticks at some point but closes at 5 ticks, then the MFE was 10 ticks. This helps you understand how much potential profit was available during the trade.">
                <th className="px-4 py-2 text-left text-slate-200">
                  {t("table.mfeTicks")}
                </th>
              </SignalToolTooltip>

              <SignalToolTooltip text="Shows how many ticks the trade moved against your position. This represents the negative movement in your trade. Higher loss ticks indicate that the trade experienced more adverse movement, which could have triggered stop losses or resulted in greater drawdowns.">
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