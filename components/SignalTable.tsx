"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";

const PerformanceTableWithMFEAndLossTicks = ({ allSignal }) => {
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

      // If resultTicks is negative, it's a loss; otherwise it's MFE
      let mfeTicks = 0;
      let lossTicks = 0;
      if (resultTicks < 0) {
        lossTicks = Math.abs(resultTicks);
      } else {
        mfeTicks = resultTicks;
      }

      return {
        ...trade,
        entry_price: entryPrice,
        exit_price: exitPrice,
        mfeTicks: Number(mfeTicks.toFixed(2)),
        lossTicks: Number(lossTicks.toFixed(2)),
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
        Trade MFE & Loss Ticks Performance Summary
      </h2>
      <div className="mb-6 grid grid-cols-2 gap-4 text-slate-200">
        <div>
          <strong>Total Trades:</strong> {summary.totalTrades}
        </div>
        <div>
          <strong>Total MFE Ticks:</strong> {summary.totalMFE}
        </div>
        <div>
          <strong>Total Loss Ticks:</strong> {summary.totalLoss}
        </div>
        <div>
          <strong>Average MFE Ticks:</strong> {summary.avgMFE}
        </div>
        <div>
          <strong>Average Loss Ticks:</strong> {summary.avgLoss}
        </div>
      </div>
      <div className="h-[500px] overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-600">
          <thead className="sticky top-0 bg-slate-700">
            <tr className="ovreflow-x-auto">
              <th className="px-4 py-2 text-left text-slate-200">Date</th>
              <th className="px-4 py-2 text-left text-slate-200">
                Entry Price
              </th>
              <th className="px-4 py-2 text-left text-slate-200">Exit Price</th>
              <th className="px-4 py-2 text-left text-slate-200">Trade Side</th>
              <th className="px-4 py-2 text-left text-slate-200">Duration</th>
              <th className="px-4 py-2 text-left text-slate-200">MFE Ticks</th>
              <th className="px-4 py-2 text-left text-slate-200">Loss Ticks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 bg-slate-800">
            {tableData.map((trade, index) => (
              <tr key={index}>
                <td className="px-4 py-2 text-slate-200">
                  {format(new Date(trade.entry_time), "dd/MM/yyyy")}
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
