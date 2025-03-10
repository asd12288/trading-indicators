"use client";

import { useAlertHours } from "@/hooks/useAlertHours";
import { getMarketHoursDisplay, isMarketOpen } from "@/lib/market-hours";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/theme-context";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Clock, Calendar, Info, Bell, Clock3, AlertTriangle } from "lucide-react";

interface SignalHoursInfoProps {
  instrumentName: string;
}

const SignalHoursInfo = ({ instrumentName }: SignalHoursInfoProps) => {
  const { theme } = useTheme();
  const t = useTranslations("SignalHoursInfo");
  const { alertHours, isSystemActive, nextActiveTime } = useAlertHours(instrumentName);
  const [activeTab, setActiveTab] = useState<'market' | 'alert'>('market');
  
  // Format market hours display
  const marketHours = getMarketHoursDisplay(instrumentName);
  const marketIsOpen = isMarketOpen(instrumentName);
  
  // Format day names for display
  const getDayName = (dayId: number) => DAYS_OF_WEEK.find(day => day.id === dayId)?.name.substring(0, 3) || "";
  
  // Format time to HH:MM
  const formatTime = (timeString: string) => timeString.substring(0, 5);
  
  return (
    <div className={cn(
      "overflow-hidden rounded-lg border",
      theme === "dark" ? "border-slate-700 bg-slate-800/90" : "border-slate-200 bg-white"
    )}>
      {/* Header with tabs - more compact */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('market')}
          className={cn(
            "flex-1 px-4 py-2.5 text-sm font-medium transition-colors",
            activeTab === 'market' 
              ? theme === "dark" 
                ? "bg-slate-700 text-white border-b-2 border-blue-500" 
                : "bg-slate-50 text-slate-900 border-b-2 border-blue-500"
              : theme === "dark"
                ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            {t("marketHours")}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('alert')}
          className={cn(
            "flex-1 px-4 py-2.5 text-sm font-medium transition-colors",
            activeTab === 'alert' 
              ? theme === "dark" 
                ? "bg-slate-700 text-white border-b-2 border-violet-500" 
                : "bg-slate-50 text-slate-900 border-b-2 border-violet-500"
              : theme === "dark"
                ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <Bell className="h-4 w-4" />
            {t("alertHours")}
          </div>
        </button>
      </div>

      {/* Content area - more compact padding */}
      <div className="p-4">
        {/* Title bar with less margin */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className={cn(
              "text-base font-medium",
              theme === "dark" ? "text-white" : "text-slate-900"
            )}>
              {instrumentName}
            </h3>
            <p className={cn(
              "text-xs mt-0.5",
              theme === "dark" ? "text-slate-400" : "text-slate-500"
            )}>
              {activeTab === 'market' ? t("marketDescription") : t("alertDescription")}
            </p>
          </div>
          
          {activeTab === 'market' ? (
            <div className={cn(
              "rounded-full px-2 py-1 text-xs font-medium",
              marketIsOpen
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
            )}>
              {marketIsOpen ? t("open") : t("closed")}
            </div>
          ) : (
            <div className={cn(
              "rounded-full px-2 py-1 text-xs font-medium",
              isSystemActive
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
            )}>
              {isSystemActive ? t("active") : t("inactive")}
            </div>
          )}
        </div>
        
        {/* Tab content - more compact spacing */}
        {activeTab === 'market' ? (
          <div className="space-y-3">
            <div className={cn(
              "rounded-lg p-3",
              theme === "dark" ? "bg-slate-700/80" : "bg-slate-100"
            )}>
              <div className="flex items-center text-xs mb-1.5">
                <Info className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                <span className="font-medium">{t("marketSchedule")}</span>
              </div>
              <p className="text-sm">{marketHours}</p>
            </div>
            
            {/* Days visualization - more compact */}
            <div className="mt-2">
              <div className="text-xs text-slate-500 mb-1.5">{t("tradingDays")}</div>
              <div className="flex justify-between gap-1">
                {DAYS_OF_WEEK.map((day) => {
                  const isActive = marketHours.includes(day.name.substring(0, 3));
                  return (
                    <div
                      key={day.id}
                      className={cn(
                        "flex h-8 w-8 flex-col items-center justify-center rounded-lg transition-colors",
                        isActive
                          ? theme === "dark"
                            ? "bg-blue-800/70 text-blue-200"
                            : "bg-blue-100 text-blue-800"
                          : theme === "dark"
                            ? "bg-slate-700 text-slate-500"
                            : "bg-slate-200 text-slate-500"
                      )}
                    >
                      <span className="text-xs font-semibold">{day.name.substring(0, 1)}</span>
                      <span className="text-[8px] opacity-80">
                        {day.name.substring(1, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {alertHours.length > 0 ? (
              <>
                <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
                  {alertHours.map((session, index) => (
                    <div
                      key={index}
                      className={cn(
                        "rounded-lg p-3 transition-all",
                        theme === "dark" ? "bg-slate-700/80" : "bg-slate-100",
                        !session.is_active && "opacity-70"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center">
                          <Clock3 className="h-3.5 w-3.5 mr-1.5 text-violet-400" />
                          <span className="font-medium text-xs">
                            {t("session")} {session.session_number}
                          </span>
                        </div>
                        {!session.is_active && (
                          <span className="text-[10px] rounded bg-slate-600 px-1.5 py-0.5 text-white">
                            {t("disabled")}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm font-semibold">
                        {formatTime(session.start_time_utc)} - {formatTime(session.end_time_utc)} <span className="text-xs font-normal opacity-70">UTC</span>
                      </div>
                      
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {session.days_active.sort().map(dayId => (
                          <span
                            key={dayId}
                            className={cn(
                              "rounded-md px-1.5 py-0.5 text-[10px]",
                              theme === "dark" 
                                ? "bg-slate-600/80 text-slate-300" 
                                : "bg-slate-200 text-slate-700"
                            )}
                          >
                            {getDayName(dayId)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {!isSystemActive && nextActiveTime && (
                  <div className="mt-2 text-[10px] bg-slate-700/40 rounded-lg p-2 text-center">
                    {t("nextActiveSession")}: <span className="font-medium text-blue-400">{nextActiveTime.toLocaleString()}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center bg-slate-700/30 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500 mb-2" />
                <p className="text-xs text-slate-400">{t("noAlertHours")}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalHoursInfo;
