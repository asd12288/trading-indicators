"use client";

import useAlerts from "@/hooks/useAlerts";
import usePreferences from "@/hooks/usePreferences";
import useProfile from "@/hooks/useProfile";
import { Link } from "@/i18n/routing";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

const AlertNotification = ({ userId, instrumentName = '' }) => {
  const { alerts, isLoading } = useAlerts();
  const { notificationsOn } = usePreferences(userId);
  const { isPro } = useProfile(userId);
  const t = useTranslations("Alert");

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  // Filter alerts based on the passed instrumentName first, if provided
  const filteredAlerts = instrumentName 
    ? alerts.filter(alert => alert.instrument_name === instrumentName)
    : isPro
      ? alerts.filter((alert) => notificationsOn.includes(alert.instrument_name))
      : alerts;

  // Check if we have any alerts to display
  if (!filteredAlerts || filteredAlerts.length === 0) {
    return <div className="text-center">
      {instrumentName 
        ? t("messages.noAlertsForInstrument", { instrument: instrumentName }) 
        : isPro 
          ? t("noAlertsPro") 
          : t("noAlertsDefault")}
    </div>;
  }

  const lastAlert = filteredAlerts[0];

  if (lastAlert.time) {
    const now = new Date();
    const alertTime = new Date(lastAlert.time);
    const minutesDiff = (now.getTime() - alertTime.getTime()) / (1000 * 60);

    if (minutesDiff > 5) {
      return <div className="text-center">{t("messages.noRecentAlerts")}</div>;
    }
  }

  const { instrument_name, price, time, trade_direction } = lastAlert;

  return (
    <div className="">
      <Link href="/alerts"></Link>
      <h4 className="animate-pulse text-center text-sm md:text-xl md:font-semibold">
        ({(time && format(new Date(time), "dd/MM hh:mm")) || "N/A"}) -{" "}
        {t("messages.alert")}{" "}
        <span
          className={`${
            trade_direction === "LONG" ? "text-green-500" : "text-red-500"
          }`}
        >
          {trade_direction}
        </span>{" "}
        {t("messages.opportunity")} {instrument_name} {t("messages.level")}{" "}
        {price}. {t("messages.stayVigilant")}
      </h4>
    </div>
  );
};

export default AlertNotification;