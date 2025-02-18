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
          <h3 className="font-semibold">Instrument Watch Alert: </h3>
          <FaRegLightbulb className="text-xl" />
        </div>
      </Link>
      <div className="mt-2 flex animate-pulse items-center justify-center gap-4 text-xl font-semibold">
        <p className="animate-none text-sm">Possible Trade on:</p>
        <p>{instrument_name}</p>
        <p>
          <span>{price}</span>
        </p>
        <p>({format(time, "MM-dd HH:mm")})</p>
        <p>{trade_direction}</p>
        <p className="font-normal">{message}</p>
      </div>
    </div>
  );
};

export default AlertNotification;
