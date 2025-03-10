import { format, formatDistanceToNow } from "date-fns";
import { useTranslations } from "next-intl";
import { Clock, Power, Calendar, Globe, MapPin, Timer } from "lucide-react";
import { getNextMarketOpen, getMarketHoursDisplay } from "@/lib/market-hours";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/theme-context";
import useInstrumentInfo from "@/hooks/useInstrumentInfo";
import { useState, useEffect } from "react";

interface MarketClosedCardProps {
  instrumentName: string;
}

const MarketClosedCard = ({ instrumentName }: MarketClosedCardProps) => {
  const { theme } = useTheme();
  const t = useTranslations("MarketClosedCard");
  const { instrumentInfo } = useInstrumentInfo(instrumentName);
  const [countdown, setCountdown] = useState<string | null>(null);

  // Get market information
  const nextOpenTime = getNextMarketOpen(instrumentName);
  const marketHours = getMarketHoursDisplay(instrumentName);

  // Convert UTC to local time
  const getLocalTimeString = (utcDate: Date): string => {
    try {
      return format(utcDate, "EEEE, h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Update countdown timer
  useEffect(() => {
    if (!nextOpenTime) return;

    const updateCountdown = () => {
      const now = new Date();
      const diffMs = nextOpenTime.getTime() - now.getTime();

      if (diffMs <= 0) {
        setCountdown("Opening now");
        return;
      }

      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      const formattedHours = diffHrs > 0 ? `${diffHrs}h ` : "";
      const formattedMins = `${diffMins}m`;

      setCountdown(`${formattedHours}${formattedMins}`);
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [nextOpenTime]);

  return (
    <div className="h-full">
      <div
        className={cn(
          "h-full overflow-hidden rounded-lg border shadow-md transition-all hover:shadow-lg",
          theme === "dark"
            ? "border-amber-500/30 bg-slate-900"
            : "border-amber-500/50 bg-white",
        )}
      >
        {/* Enhanced status banner with gradient */}
        <div
          className={cn(
            "py-2 text-center font-medium text-white",
            theme === "dark"
              ? "bg-gradient-to-r from-amber-700 to-amber-500"
              : "bg-gradient-to-r from-amber-600 to-amber-400",
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
            <span>{t("marketClosed")}</span>
          </div>
        </div>

        <div className="p-5">
          {/* Card header with instrument name */}
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <h3
                className={cn(
                  "text-4xl font-bold",
                  theme === "dark" ? "text-white" : "text-slate-900",
                )}
              >
                {instrumentName}
              </h3>
            </div>

            {/* Full instrument name display */}
            {instrumentInfo && (
              <div className="mt-1 text-sm text-slate-400">
                {instrumentInfo.full_name || ""}
              </div>
            )}
          </div>

          {/* Status message with icon */}
          <div
            className={cn(
              "mb-6 flex items-center rounded-md px-4 py-2.5",
              theme === "dark" ? "bg-amber-950/30" : "bg-amber-50",
            )}
          >
            <Power className="mr-3 h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              {t("trading")}
            </span>
          </div>

          {/* Next opening time with local time and countdown */}
          {nextOpenTime && (
            <div
              className={cn(
                "mb-4 rounded-lg p-4",
                theme === "dark" ? "bg-slate-800/70" : "bg-slate-100",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{t("nextOpen")}</span>
                </div>

                {countdown && (
                  <div className="flex items-center text-xs font-medium text-emerald-500">
                    <Timer className="mr-1 h-3.5 w-3.5" />
                    <span>Opens in {countdown}</span>
                  </div>
                )}
              </div>

              {/* UTC time */}
              <div className="mt-3 flex items-center space-x-2">
                <Globe className="h-4 w-4 text-blue-400" />
                <div>
                  <div className="text-xs text-slate-500">UTC</div>
                  <div className="text-lg font-bold">
                    {format(nextOpenTime, "EEEE, h:mm a")}
                  </div>
                </div>
              </div>

              {/* Local time */}
              <div className="mt-2 flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <div>
                  <div className="text-xs text-slate-500">{t("localTime")}</div>
                  <div className="text-lg font-bold">
                    {getLocalTimeString(nextOpenTime)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Market hours info with visual improvements */}
          <div
            className={cn(
              "rounded-lg p-4",
              theme === "dark" ? "bg-slate-800/70" : "bg-slate-100",
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{t("marketHours")}</span>
              </div>
            </div>

            <div className="mt-2">
              <div
                className={cn(
                  "rounded-md px-3 py-2",
                  theme === "dark" ? "bg-slate-700" : "bg-slate-200",
                )}
              >
                <div className="flex gap-2 text-sm">
                  <Globe className="h-4 w-4 flex-shrink-0 text-blue-400" />
                  <div className="text-sm leading-tight">{marketHours}</div>
                </div>
              </div>

              {/* Trading days visualization */}
              <div className="mt-3 flex justify-between">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day, index) => {
                    const isActive = marketHours.includes(day);
                    return (
                      <div
                        key={day}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                          isActive
                            ? theme === "dark"
                              ? "bg-blue-900/50 text-blue-300"
                              : "bg-blue-100 text-blue-800"
                            : theme === "dark"
                              ? "bg-slate-800 text-slate-500"
                              : "bg-slate-200 text-slate-500",
                        )}
                      >
                        {day.charAt(0)}
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketClosedCard;
