"use client";
import { EconomicCalendar } from "react-ts-tradingview-widgets";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { NewsTabProps } from "./types";
import BlurOverlay from "../BlurOverlay";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import EconomicCalendarComponent from "../EconomicCalendar/EconomicCalendarComponent";

export default function NewsTab({
  theme,
  instrumentName,
  isPro,
  handleUpgradeClick,
  economicEvents,
  isCalendarLoading,
  loadCalendarData,
}: NewsTabProps) {
  const t = useTranslations("SignalLayout");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative overflow-hidden rounded-xl border shadow-lg transition-all duration-300 hover:shadow-xl",
        theme === "dark"
          ? "border-slate-700/50 bg-slate-800/90 backdrop-blur-sm"
          : "border-slate-200 bg-white",
      )}
    >
      {!isPro && (
        <BlurOverlay
          title={t("premium.newsTitle")}
          description={t("premium.newsDescription")}
          onUpgradeClick={handleUpgradeClick}
        />
      )}
      <div className={!isPro ? "blur-sm" : ""}>
        <div className="p-4">
          <div className="mb-3 flex items-center">
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
              {t("tabs.news")} - {instrumentName}
            </h3>
          </div>

          {/* Economic Calendar Widget */}
          <div className="mt-4">
            <div className="mb-4 flex items-center justify-between">
              <h4
                className={cn(
                  "font-medium",
                  theme === "dark" ? "text-slate-300" : "text-slate-700",
                )}
              >
                Economic Calendar
              </h4>
              <Button
                size="sm"
                onClick={loadCalendarData}
                variant="outline"
                className="flex items-center gap-1"
                disabled={isCalendarLoading}
              >
                <RefreshCw
                  size={14}
                  className={isCalendarLoading ? "animate-spin" : ""}
                />
                Refresh
              </Button>
            </div>
            {economicEvents && economicEvents.length > 0 ? (
              <EconomicCalendarComponent
                events={economicEvents}
                isLoading={isCalendarLoading}
              />
            ) : (
              <div className="mt-2">
                <div className="mb-2 text-center text-sm text-slate-400">
                  Using TradingView Economic Calendar
                </div>
                <div className="tradingview-widget-container">
                  <div className="tradingview-widget-container__widget"></div>
                  <EconomicCalendar
                    colorTheme="dark"
                    height={400}
                    width="100%"
                  ></EconomicCalendar>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
