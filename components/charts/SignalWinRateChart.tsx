"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"]; // matching the green/red scheme

const SignalWinRateChart = ({ allSignals }) => {
  const [chartData, setChartData] = useState<any[] | null>(null);

  useEffect(() => {
    if (!allSignals || !Array.isArray(allSignals)) return;

    const totalPositiveTicks = allSignals
      .filter((sig) => sig.result_ticks > 0)
      .reduce((acc, sig) => acc + sig.result_ticks, 0);

    const totalNegativeTicks = allSignals
      .filter((sig) => sig.result_ticks < 0)
      .reduce((acc, sig) => acc + Math.abs(sig.result_ticks), 0);

    setChartData([
      { name: "Positive Ticks", value: totalPositiveTicks },
      { name: "Negative Ticks", value: totalNegativeTicks },
    ]);
  }, [allSignals]);

  if (!chartData) {
    return (
      <div className="mt-4 text-center text-slate-400">Loading chart...</div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center rounded-2xl bg-slate-800 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-slate-100">
        Trade Tick Distribution
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            fill="#8884d8"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip wrapperClassName="bg-slate-700 text-slate-100 p-2 rounded" />
          <Legend wrapperStyle={{ color: "#cbd5e1" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SignalWinRateChart;
