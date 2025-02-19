"use client";
import React, { useState, useEffect } from "react";
// filepath: /c:/Users/ilanc/Desktop/indicators/components/admin/SignalsMonitoring.tsx

export default function SignalsMonitoring({ signalsStatus }) {
  const [tick, setTick] = useState(0);

  // Re-render periodically to re-check times
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="grid gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
        {uniqueSignals.map((signal) => {
          const signalTime = new Date(signal.time);
          signalTime.setHours(signalTime.getHours() - 2);
          const now = new Date();
          const threeMinutes = 3 * 60 * 1000;
          const isActive = now.getTime() - signalTime.getTime() < threeMinutes;
          return (
            <div
              key={signal.id}
              className={`rounded border text-slate-50 ${
                isActive ? "bg-green-900" : "bg-red-900"
              } p-4 shadow-md`}
            >
              <div className="flex justify-between">
                <div className="flex flex-col justify-center">
                  <p className="mb-2 text-2xl font-semibold">
                    {signal.instrument_name}
                  </p>
                  <p className="mb-2 text-sm">{signalTime.toLocaleString()}</p>
                  <p className="text-sm">
                    Status:{" "}
                    <span className="text-xl font-medium">
                      {isActive ? signal.status : "Deactivated"}
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
