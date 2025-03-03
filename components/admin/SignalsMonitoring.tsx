"use client";
import React from "react";
import { useSignalsStatus } from "@/hooks/useSignalsStatus";
import AdminMaintenance from "./AdminMaintenance"

export default function SignalsMonitoring() {
  const { signalsStatus, loading, error } = useSignalsStatus();

  if (loading) return <p>Loading signals...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>

      <AdminMaintenance />


      <h2 className="mb-4 text-2xl font-bold">Status Monitoring</h2>
      <div className="grid gap-4 p-4 md:grid-cols-4 lg:grid-cols-6">
        {signalsStatus.map((signal) => (
          <div
            key={signal.id}
            className={`rounded border text-slate-50 ${signal.statusColor} flex flex-col p-4 shadow-md`}
          >
            <div className="">
              <div className="flex flex-col justify-center">
                <div className="flex items-center justify-between gap-2">
                  <p className="mb-2 text-2xl font-semibold">
                    {signal.instrument_name}
                  </p>
                  <p className="text-lg font-medium uppercase">
                    {signal.position_status}
                  </p>
                </div>
                <p className="mb-2 text-sm">{signal.displayTime}</p>
                <p className="text-sm">
                  Status:{" "}
                  <span className="text-sm font-semibold">
                    {signal.displayStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
