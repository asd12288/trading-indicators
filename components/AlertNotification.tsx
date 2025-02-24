"use client";

import useAlerts from "@/hooks/useAlerts";
import usePreferences from "@/hooks/usePreferences";
import useProfile from "@/hooks/useProfile";
import { format } from "date-fns";
import Link from "next/link";



const AlertNotification = ({ userId }) => {
  const { alerts, isLoading } = useAlerts();
  const { notificationsOn } = usePreferences(userId);
  const { isPro } = useProfile(userId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const alertsToDisplay = isPro
    ? alerts.filter((alert) => notificationsOn.includes(alert.instrument_name))
    : alerts;

  if (!alertsToDisplay || (alertsToDisplay.length === 0 && !isPro)) {
    return <div className="text-center">No alerts available</div>;
  }

  if (!alertsToDisplay || (alertsToDisplay.length === 0 && isPro)) {
    return (
      <div className="text-center">
        No alerts available. Turn on notifications on signals to get alerts
      </div>
    );
  }

  const lastAlert = alertsToDisplay[0];

  if (lastAlert.time) {
    const now = new Date();
    const alertTime = new Date(lastAlert.time);
    const minutesDiff = (now.getTime() - alertTime.getTime()) / (1000 * 60);

    if (minutesDiff > 5) {
      return <div className="text-center">No alerts available for now</div>;
    }
  }

  if (!lastAlert || lastAlert === null) {
    return <div className="text-center">No alerts available</div>;
  }

  const { instrument_name, price, time, trade_direction } = lastAlert;

  return (
    <div className="">
      <Link href="/alerts"></Link>
      <h4 className="animate-pulse text-center text-sm md:text-xl md:font-semibold">
        ({(time && format(new Date(time), "dd/MM hh:mm")) || "N/A"}) - Alert:
        Potential{" "}
        <span
          className={` ${trade_direction === "LONG" ? "text-green-500" : "text-red-500"}`}
        >
          {trade_direction}
        </span>{" "}
        Opportunity on {instrument_name} - Level {price}. Stay vigilant.
      </h4>
    </div>
  );
};

export default AlertNotification;
