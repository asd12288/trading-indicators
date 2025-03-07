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
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

const CumulativePotentialTicksChart = ({ allSignal }) => {
  const [chartData, setChartData] = useState([]);
  const t = useTranslations("SignalPerformanceChart");

  useEffect(() => {
    if (!allSignal || !allSignal.length) return;

    // Sort trades by entry time to ensure proper cumulative calculation.
    const sortedTrades = [...allSignal].sort(
      (a, b) => new Date(a.entry_time) - new Date(b.entry_time),
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
      <div className="flex h-64 items-center justify-center p-6">
        <div className="flex animate-pulse space-x-4">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
        </div>
      </div>
    );
  }

  // Calculate if performance is positive overall
  const lastValue = chartData[chartData.length - 1]?.cumulativePotential || 0;
  const performanceColor = lastValue >= 0 ? "#10b981" : "#ef4444";

  return (
    <div className="w-full p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-slate-100">{t("title")}</h2>
          <p className="mt-1 text-sm text-slate-400">
            {t("subtitle", { count: chartData.length })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-slate-400">{t("performance")}:</div>
          <div
            className={`font-mono text-lg font-bold ${lastValue >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {lastValue > 0 ? "+" : ""}
            {lastValue.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-slate-800/50 p-4 shadow-inner">
        <ResponsiveContainer width="100%" height={380}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              opacity={0.3}
            />
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={performanceColor}
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor={performanceColor}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              tickFormatter={(dateString) =>
                format(new Date(dateString), "dd/MM")
              }
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value > 0 ? "+" : ""}${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                borderRadius: "8px",
                border: "1px solid rgba(100, 116, 139, 0.3)",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                padding: "8px 12px",
              }}
              labelStyle={{ color: "#e2e8f0", fontWeight: 500 }}
              itemStyle={{ color: "#e2e8f0" }}
              labelFormatter={(label) => format(new Date(label), "dd MMM yyyy")}
              formatter={(value) => [
                `${value > 0 ? "+" : ""}${value}`,
                t("legend.cumulativePotential"),
              ]}
            />
            <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
            <Legend
              wrapperStyle={{ color: "#cbd5e1", paddingTop: "10px" }}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="cumulativePotential"
              name={t("legend.cumulativePotential")}
              stroke={performanceColor}
              strokeWidth={2.5}
              activeDot={{ r: 6, strokeWidth: 1, stroke: "#0f172a" }}
              dot={{ r: 0 }}
              fill="url(#colorUv)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CumulativePotentialTicksChart;
