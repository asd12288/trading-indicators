'use client'

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
import supabase from "@/database/supabase/supabase";

const PerformanceChart = ({ signalPassed }) => {
  const [chartData, setChartData] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      const { data, error } = await supabase
        .from(signalPassed)
        .select(
          "entry_time, entry_price, exit_price, trade_side, trade_duration",
        );

      if (error || !data) {
        console.error("Error fetching performance data:", error);
        return;
      }
      // Convert strings to numbers where needed and keep trade_side as string
      const formattedData = data.map((trade: any) => ({
        entry_time: trade.entry_time,
        entry_price: Number(trade.entry_price),
        exit_price: Number(trade.exit_price),
        trade_side: trade.trade_side,
        trade_duration: trade.trade_duration,
      }));

      setChartData(formattedData);
    };

    fetchPerformanceData();
  }, [signalPassed]);

  if (!chartData) {
    return (
      <div className="mt-4 text-center text-slate-400">Loading chart...</div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center rounded-2xl bg-slate-800 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-slate-100">
        Trade Price and Duration Over Time
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          {/* Use a formatter to show only dd/MM */}
          <XAxis
            dataKey="entry_time"
            stroke="#cbd5e1"
            tickFormatter={(dateString) =>
              format(new Date(dateString), "dd/MM")
            }
          />
          <YAxis stroke="#cbd5e1" scale="log" domain={["auto", "auto"]} />
          <Tooltip
            wrapperClassName="bg-slate-700 text-slate-100 p-2 rounded"
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload.length) {
                return null;
              }
              const item = payload[0].payload;
              return (
                <div className="rounded bg-slate-700 p-2">
                  <p>Date: {format(new Date(item.entry_time), "dd/MM/yyyy")}</p>
                  <p>Entry Price: {item.entry_price}</p>
                  <p>Exit Price: {item.exit_price}</p>
                  <p>Trade Side: {item.trade_side}</p>
                  <p>Duration: {item.trade_duration}</p>
                </div>
              );
            }}
          />
          <Legend wrapperStyle={{ color: "#cbd5e1" }} />
          <Line
            type="monotone"
            dataKey="entry_price"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ r: 1, fill: "#22c55e" }}
            name="Entry Price"
          />
          <Line
            type="monotone"
            dataKey="exit_price"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            name="Exit Price"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
