"use client";
import React, { useState, useEffect } from "react";
import { useSignalsStatus } from "@/hooks/useSignalsStatus";
import { format } from "date-fns";

export default function SignalsMonitoring() {
  const { signalsStatus, loading, error } = useSignalsStatus();
  const [tick, setTick] = useState(0);

  // Re-render periodically to re-check times
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading signals...</p>;
  if (error) return <p>Error: {error}</p>;

  const uniqueSignals = Object.values(
    signalsStatus.reduce((acc, signal) => {
      const { instrument_name } = signal;
      if (
        !acc[instrument_name] ||
        new Date(signal.time) > new Date(acc[instrument_name].time)
      ) {
        acc[instrument_name] = signal;
      }
      return acc;
    }, {}),
  );

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Status Monitoring</h2>
      <div className="grid gap-4 p-4 md:grid-cols-4 lg:grid-cols-6">
        {uniqueSignals.map((signal) => {
          const signalTime = new Date(signal.time);
          // Remove 2 hours from the signal time
          signalTime.setHours(signalTime.getHours() - 2);
          const now = new Date();
          const fiveMinutes = 5 * 60 * 1000;
          const isActive = now.getTime() - signalTime.getTime() < fiveMinutes;
          const isStandBy = isActive && signal.status === "STAND-BY";

          return (
            <div
              key={signal.id}
              className={`rounded border text-slate-50 ${isStandBy ? "bg-blue-950" : isActive ? "bg-green-700" : "bg-red-700"} flex flex-col p-4 shadow-md`}
            >
              <div className=" ">
                <div className="flex flex-col justify-center">
                  <div className="flex items-center justify-between gap-2">
                    <p className="mb-2 text-2xl font-semibold">
                      {signal.instrument_name}
                    </p>
                    <p className="text-lg uppercase font-medium">
                      {signal.position_status}
                    </p>
                  </div>
                  <p className="mb-2 text-sm">
                    {format(signalTime.toLocaleString(), "MM-dd - hh:mm")}
                  </p>
                  <p className="text-sm">
                    Status:{" "}
                    <span className="text-sm font-semibold">
                      {isStandBy
                        ? "Stand-By"
                        : isActive
                          ? signal.status
                          : "Deactivated"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
