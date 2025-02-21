"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

const CumulativePotentialTicksChart = ({ allSignal }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!allSignal || !allSignal.length) return;

    // Sort trades by entry time to ensure proper cumulative calculation.
    const sortedTrades = [...allSignal].sort(
      (a, b) => new Date(a.entry_time) - new Date(b.entry_time)
    );

    let cumulativePotential = 0;
    const data = sortedTrades.map((trade) => {
      const entryPrice = Number(trade.entry_price);
      const exitPrice = Number(trade.exit_price);
      const side = trade.trade_side.toLowerCase();
      let value = 0;

      if (side === "short") {
        if (entryPrice > exitPrice) {
          // Winning short trade: use MFE potential.
          value =
            trade.mfe !== undefined
              ? Number(trade.mfe)
              : entryPrice - exitPrice;
        } else {
          // Losing short trade: use negative loss ticks.
          value =
            trade.loss !== undefined
              ? -Number(trade.loss)
              : -(exitPrice - entryPrice);
        }
      } else {
        if (exitPrice > entryPrice) {
          // Winning long trade: use MFE potential.
          value =
            trade.mfe !== undefined
              ? Number(trade.mfe)
              : exitPrice - entryPrice;
        } else {
          // Losing long trade: use negative loss ticks.
          value =
            trade.loss !== undefined
              ? -Number(trade.loss)
              : -(entryPrice - exitPrice);
        }
      }

      cumulativePotential += value;

      return {
        date: trade.entry_time,
        cumulativePotential: Number(cumulativePotential.toFixed(2)),
      };
    });

    setChartData(data);
  }, [allSignal]);

  if (!chartData.length) {
    return (
      <div className="mt-4 text-center text-slate-400">
        Loading chart...
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-slate-800 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-slate-100">
        Cumulative Potential Ticks
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            stroke="#cbd5e1"
            tickFormatter={(dateString) =>
              format(new Date(dateString), "dd/MM")
            }
          />
          <YAxis stroke="#cbd5e1" />
          <Tooltip
            wrapperClassName="bg-slate-700 text-slate-100 p-2 rounded"
            labelFormatter={(label) =>
              format(new Date(label), "dd/MM/yyyy")
            }
          />
          <Legend wrapperStyle={{ color: "#cbd5e1" }} />
          <Line
            type="monotone"
            dataKey="cumulativePotential"
            name="Cumulative Potential Ticks"
            stroke="#18d100"
            strokeWidth={2}
            dot={{ r: 2, fill: "#3b82f6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CumulativePotentialTicksChart;
