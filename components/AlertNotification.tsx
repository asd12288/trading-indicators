"use client";

import useAlerts from "@/hooks/useAlerts";
import usePreferences from "@/hooks/usePreferences";
import { format } from "date-fns";
import Link from "next/link";
import { FaRegLightbulb } from "react-icons/fa6";

const AlertNotification = ({ userId }) => {
  const { alerts, isLoading } = useAlerts();
  const { notificationsOn } = usePreferences(userId);

  const notificationUserOn = alerts.filter((alert) => {
    return notificationsOn.includes(alert.instrument_name);
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!notificationUserOn || notificationUserOn.length === 0) {
    return <div className="text-center">No alerts available</div>;
  }

  const {
    instrument_name,
    price,
    time,
    trade_direction,
    message = "",
  } = notificationUserOn[0];

  return (
    <div className="mt-2">
      <Link href="/alerts">
        <div className="flex items-center justify-center gap-2">
          <h3 className="font-semibold">Alerts Upcoming Signals</h3>
          <FaRegLightbulb className="text-xl" />
        </div>
      </Link>
      <h4 className="mt-2 animate-pulse text-center text-xl font-semibold">
        Alert: Potential {trade_direction} on {instrument_name} - {price} Stay
        vigilant ({(time && format(new Date(time), "dd/MM/yyyy")) || "N/A"})
      </h4>
    </div>
  );
};

export default AlertNotification;
