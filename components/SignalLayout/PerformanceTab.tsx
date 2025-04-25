"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TabContentProps } from "./types";
import SignalTable from "@/components/SignalTable";
import CumulativePotentialTicksChart from "@/components/charts/CumulativePotentialTicksChart";

export default function PerformanceTab({
  theme,
  instrumentData,
  tradeId,
  isPro,
}: TabContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border shadow-lg transition-all duration-300 hover:shadow-xl",
          theme === "dark"
            ? "border-slate-700/50 bg-slate-800/90 backdrop-blur-sm"
            : "border-slate-200 bg-white",
        )}
      >
        <div>
          <SignalTable allSignal={instrumentData} highlightTradeId={tradeId} />
        </div>
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-xl border shadow-lg transition-all duration-300 hover:shadow-xl",
          theme === "dark"
            ? "border-slate-700/50 bg-slate-800/90 backdrop-blur-sm"
            : "border-slate-200 bg-white",
        )}
      >
        {!isPro && <div className="absolute inset-0 bg-slate-900/30" />}
        <div>
          <CumulativePotentialTicksChart allSignal={instrumentData} />
        </div>
      </div>
    </motion.div>
  );
}
