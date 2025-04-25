"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TabContentProps } from "./types";
import SignalCard from "../SignalCard/SignalCard";
import BlurOverlay from "../BlurOverlay";
import InstrumentStatusCard from "../InstrumentStatusCard";
import SignalHoursInfo from "../SignalHoursInfo";
import { useTranslations } from "next-intl";

export default function OverviewTab({
  theme,
  instrumentName,
  isPro,
  handleUpgradeClick,
  lastSignal,
  tradeId,
}: TabContentProps) {
  const t = useTranslations("SignalLayout");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Main container with responsive grid setup - adjusted gap and height */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column - Signal Status */}
        <div
          className={cn(
            "rounded-xl border shadow-lg transition-all",
            theme === "dark"
              ? "border-slate-700/50 bg-slate-800/90 backdrop-blur-sm"
              : "border-slate-200 bg-white",
          )}
        >
          {/* Reduced padding */}
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={cn(
                    "mr-2 h-3 w-3 rounded-full",
                    theme === "dark" ? "bg-blue-400" : "bg-blue-500",
                  )}
                ></div>
                <h3
                  className={cn(
                    "text-sm font-medium uppercase tracking-wider",
                    theme === "dark" ? "text-slate-300" : "text-slate-700",
                  )}
                >
                  {t("signalStatusTitle")}
                </h3>
              </div>

              {/* Show indicator when viewing a specific trade */}
              {tradeId && (
                <div className="rounded bg-blue-900/20 px-2 py-1 text-xs text-blue-400">
                  Viewing specific trade
                </div>
              )}
            </div>

            <SignalCard signalPassed={lastSignal} />
          </div>
        </div>

        {/* Right column - Instrument Status */}
        <div
          className={cn(
            "relative rounded-xl border shadow-lg transition-all",
            theme === "dark"
              ? "border-slate-700/50 bg-slate-800/90 backdrop-blur-sm"
              : "border-slate-200 bg-white",
          )}
        >
          {/* Show blur overlay for free users */}
          {!isPro && (
            <BlurOverlay
              title={t("premium.statusTitle")}
              description={t("premium.statusDescription")}
              onUpgradeClick={handleUpgradeClick}
            />
          )}

          <div className={!isPro ? "blur-sm" : ""}>
            {/* Removed padding wrapper to avoid double padding */}
            <div className="mb-3 flex items-center px-4 pt-4">
              <div
                className={cn(
                  "mr-2 h-3 w-3 rounded-full",
                  theme === "dark" ? "bg-amber-400" : "bg-amber-500",
                )}
              ></div>
              <h3
                className={cn(
                  "text-sm font-medium uppercase tracking-wider",
                  theme === "dark" ? "text-slate-300" : "text-slate-700",
                )}
              >
                {t("instrumentStatusTitle")}
              </h3>
            </div>

            <InstrumentStatusCard instrumentName={instrumentName} />
          </div>
        </div>

        {/* Full width section - Trading Hours */}
        <div
          className={cn(
            "relative rounded-xl border shadow-lg transition-all lg:col-span-2",
            theme === "dark"
              ? "border-slate-700/50 bg-slate-800/90 backdrop-blur-sm"
              : "border-slate-200 bg-white",
          )}
        >
          <div className="p-4">
            <div className="mb-3 flex items-center">
              <div
                className={cn(
                  "mr-2 h-3 w-3 rounded-full",
                  theme === "dark" ? "bg-violet-400" : "bg-violet-500",
                )}
              ></div>
              <h3
                className={cn(
                  "text-sm font-medium uppercase tracking-wider",
                  theme === "dark" ? "text-slate-300" : "text-slate-700",
                )}
              >
                {t("tradingHoursTitle")}
              </h3>
            </div>

            <SignalHoursInfo instrumentName={instrumentName} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
