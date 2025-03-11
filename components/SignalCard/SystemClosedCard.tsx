import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { Clock, Calendar, AlertTriangle, Timer, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/theme-context";
import useInstrumentInfo from "@/hooks/useInstrumentInfo";
import { useState, useEffect } from "react";
import { useAlertHours } from "@/hooks/useAlertHours";

interface SystemClosedCardProps {
  instrumentName: string;
}

const SystemClosedCard = ({ instrumentName }: SystemClosedCardProps) => {
  const { theme } = useTheme();
  const t = useTranslations("SystemClosedCard");
  const { instrumentInfo } = useInstrumentInfo(instrumentName);
  const { nextActiveTime, alertHours } = useAlertHours(instrumentName);
  const [countdown, setCountdown] = useState<string | null>(null);

  // Update countdown timer
  useEffect(() => {
    if (!nextActiveTime) return;

    const updateCountdown = () => {
      const now = new Date();
      const diffMs = nextActiveTime.getTime() - now.getTime();

      if (diffMs <= 0) {
        setCountdown("Starting now");
        return;
      }

      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      let countdownText = "";
      if (diffHrs > 0) {
        countdownText += `${diffHrs}h `;
      }
      countdownText += `${diffMins}m`;

      setCountdown(countdownText);
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 30000); // Update every 30 seconds

    return () => clearInterval(intervalId);
  }, [nextActiveTime]);

  // Extract sessions info for display
  const formatSessionTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  // Get active sessions for display
  const activeSessions = alertHours.map((session, index) => ({
    session: session.session_number,
    time: `${formatSessionTime(session.start_time_utc)} - ${formatSessionTime(session.end_time_utc)} UTC`,
    days: session.days_active
      .map((day) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day])
      .join(", "),
  }));

  return (
    <div className="h-full">
      <div
        className={cn(
          "h-full overflow-hidden rounded-lg border shadow-md transition-all hover:shadow-lg",
          theme === "dark"
            ? "border-blue-500/30 bg-slate-900"
            : "border-blue-500/50 bg-white",
        )}
      >
        {/* Status banner */}
        <div
          className={cn(
            "py-2 text-center font-medium text-white",
            theme === "dark"
              ? "bg-gradient-to-r from-blue-900 to-blue-600"
              : "bg-gradient-to-r from-blue-700 to-blue-500",
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <span>{t("alertsOffline")}</span>
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

          {/* Status message */}
          <div
            className={cn(
              "mb-6 flex items-center rounded-md px-4 py-2.5",
              theme === "dark" ? "bg-blue-900/30" : "bg-blue-50",
            )}
          >
            <AlertTriangle className="mr-3 h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {t("systemMessage")}
            </span>
          </div>

          {/* Next alert session */}
          {nextActiveTime && (
            <div
              className={cn(
                "mb-4 rounded-lg p-4",
                theme === "dark" ? "bg-slate-800/70" : "bg-slate-100",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{t("nextSession")}</span>
                </div>

                {countdown && (
                  <div className="flex items-center text-xs font-medium text-blue-500">
                    <Timer className="mr-1 h-3.5 w-3.5" />
                    <span>
                      {t("startsIn")} {countdown}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 text-lg font-medium">
                {format(nextActiveTime, "EEEE, HH:mm")} UTC
              </div>
            </div>
          )}

          {/* Alert sessions list */}
          <div
            className={cn(
              "rounded-lg p-4",
              theme === "dark" ? "bg-slate-800/70" : "bg-slate-100",
            )}
          >
            <div className="mb-2 flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{t("alertSessions")}</span>
            </div>

            <div className="mt-3 space-y-2">
              {activeSessions.length > 0 ? (
                activeSessions.map((session, index) => (
                  <div
                    key={index}
                    className={cn(
                      "rounded-md p-3",
                      theme === "dark" ? "bg-slate-700" : "bg-slate-200",
                    )}
                  >
                    <div className="flex justify-between">
                      <div className="text-sm font-medium">
                        {t("session")} {session.session}
                      </div>
                      <div className="text-xs text-slate-500">
                        {session.days}
                      </div>
                    </div>
                    <div className="mt-1 text-lg font-medium">{session.time}</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-slate-500">
                  {t("noSessionsConfigured")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemClosedCard;
