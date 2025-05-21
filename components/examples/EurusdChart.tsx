"use client";

import TradingViewWidget from "@/components/TradingViewWidget";
import { cn } from "@/lib/utils";

export default function EurusdChart() {
  const theme = "dark";

  return (
    <div
      className={cn(
        "rounded-lg border p-4 shadow-md",
        theme === "dark"
          ? "border-slate-700 bg-slate-900"
          : "border-slate-200 bg-white",
      )}
    >
      <h2
        className={cn(
          "mb-4 text-xl font-bold",
          theme === "dark" ? "text-white" : "text-slate-800",
        )}
      >
        EUR/USD Chart
      </h2>

      <div className="h-[400px]">
        <TradingViewWidget
          symbol="EURUSD"
          height={350}
          interval="15"
          lightweight={false} // Set to false to show more chart details
          showToolbar={true} // Show the toolbar for more controls
          isBuy={true} // Use green as the primary color
          demo={false} // Use real data, not demo mode
        />
      </div>

      <div className="mt-4 text-center text-xs text-slate-500">
        Data provided by TradingView
      </div>
    </div>
  );
}
