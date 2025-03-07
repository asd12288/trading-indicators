"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TradingLoader: React.FC = () => {
  const [tickerValues, setTickerValues] = useState<number[]>(
    Array(20)
      .fill(0)
      .map(() => 50 + Math.random() * 20),
  );

  // Generate ticker movement animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerValues((prev) => {
        const newValues = [...prev];
        // Remove first value and add a new one at the end
        newValues.shift();

        // Generate next value with some randomness but following previous trend
        const lastValue = newValues[newValues.length - 1];
        const change = (Math.random() - 0.5) * 8;
        let newValue = lastValue + change;

        // Keep within bounds
        newValue = Math.max(30, Math.min(90, newValue));

        newValues.push(newValue);
        return newValues;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Calculate line points for SVG path
  const points = tickerValues
    .map(
      (value, index) => `${(index / (tickerValues.length - 1)) * 100},${value}`,
    )
    .join(" ");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="flex flex-col items-center">
        {/* Spinner with price chart */}
        <div className="relative h-40 w-40">
          {/* Outer ring */}
          <svg
            className="animate-spin-slow absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(99, 102, 241, 0.2)"
              strokeWidth="2"
              strokeDasharray="5 3"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="1"
              strokeDasharray="1 15"
            />
          </svg>

          {/* Spinning chart lines */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
            {/* Chart background */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="rgba(15, 23, 42, 0.8)"
              stroke="rgba(99, 102, 241, 0.2)"
              strokeWidth="1"
            />

            {/* Price line */}
            <g transform="translate(0, 0)">
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                d={`M ${points}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          </svg>

          {/* Ticker value in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="block text-2xl font-bold text-white">
                <motion.span
                  key={tickerValues[tickerValues.length - 1]}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={
                    tickerValues[tickerValues.length - 1] >
                    tickerValues[tickerValues.length - 2]
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {(tickerValues[tickerValues.length - 1] / 10).toFixed(1)}
                </motion.span>
              </span>
            </div>
          </div>
        </div>

        {/* Trading dots */}
        <div className="mt-6 flex space-x-3">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 1.5,
              delay: 0,
            }}
            className="h-3 w-3 rounded-full bg-green-500"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 1.5,
              delay: 0.5,
            }}
            className="h-3 w-3 rounded-full bg-blue-500"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 1.5,
              delay: 1,
            }}
            className="h-3 w-3 rounded-full bg-red-500"
          />
        </div>

        <p className="mt-4 text-sm text-slate-400">Loading market data...</p>
      </div>
    </div>
  );
};

export default TradingLoader;
