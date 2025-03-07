"use client";
import React, { useState } from "react";
import { useSignalsStatus } from "@/hooks/useSignalsStatus";
import AdminMaintenance from "./AdminMaintenance";
import {
  ChartBarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function SignalsMonitoring() {
  const { signalsStatus, loading, error } = useSignalsStatus();
  const [filter, setFilter] = useState("all");

  // Calculate summary counts
  const summaryCounts =
    !loading && !error
      ? {
          total: signalsStatus.length,
          active: signalsStatus.filter((s) => s.position_status === "ACTIVE")
            .length,
          pending: signalsStatus.filter((s) => s.position_status === "PENDING")
            .length,
          error: signalsStatus.filter(
            (s) =>
              s.displayStatus.includes("Error") ||
              s.displayStatus.includes("Failed"),
          ).length,
        }
      : { total: 0, active: 0, pending: 0, error: 0 };

  // Function to determine border color class based on signal status
  const getStatusColorClass = (signal) => {
    if (signal.position_status === "ACTIVE") {
      return "border-green-500";
    } else if (signal.position_status === "PENDING") {
      return "border-yellow-500";
    } else if (
      signal.displayStatus.includes("Error") || 
      signal.displayStatus.includes("Failed")
    ) {
      return "border-red-500";
    }
    return "border-gray-200"; // default color
  };

  const filteredSignals =
    !loading && !error
      ? filter === "all"
        ? signalsStatus
        : signalsStatus.filter(
            (s) => s.position_status.toLowerCase() === filter,
          )
      : [];

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-6 flex items-center">
          <ChartBarIcon className="mr-2 h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold">Status Monitoring</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-md border border-slate-200 bg-slate-100 p-4"
            >
              <div className="mb-4 h-6 w-3/4 rounded bg-slate-800"></div>
              <div className="mb-2 h-4 w-1/2 rounded bg-slate-200"></div>
              <div className="h-4 w-2/3 rounded bg-slate-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center p-6">
        <ExclamationCircleIcon className="mb-4 h-12 w-12 text-red-500" />
        <h3 className="mb-2 text-xl font-semibold">Error Loading Signals</h3>
        <p className="mb-4 text-gray-600">{error}</p>
        <button
          className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          <ArrowPathIcon className="mr-2 h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6">
      <AdminMaintenance />

      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <ChartBarIcon className="mr-2 h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-bold">Status Monitoring</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-md px-3 py-2 text-sm ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              All ({summaryCounts.total})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`rounded-md px-3 py-2 text-sm ${filter === "active" ? "bg-green-500 text-white" : "bg-gray-200"}`}
            >
              Active ({summaryCounts.active})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`rounded-md px-3 py-2 text-sm ${filter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
            >
              Pending ({summaryCounts.pending})
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Signals</p>
            <p className="text-2xl font-bold">{summaryCounts.total}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {summaryCounts.active}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {summaryCounts.pending}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Errors</p>
            <p className="text-2xl font-bold text-red-600">
              {summaryCounts.error}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {filteredSignals.map((signal) => (
          <div
            key={signal.id}
            className={`rounded-lg border ${getStatusColorClass(signal)} flex flex-col p-5 shadow-md transition-shadow hover:shadow-lg`}
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="truncate text-xl font-semibold">
                {signal.instrument_name}
              </h3>
              {signal.position_status === "ACTIVE" && (
                <CheckCircleIcon className="h-5 w-5 text-green-300" />
              )}
            </div>

            <div className="mt-1 flex flex-col">
              <div className="mb-3 inline-block self-start rounded bg-black bg-opacity-20 px-2 py-1">
                <p className="text-sm font-medium uppercase">
                  {signal.position_status}
                </p>
              </div>

              <div className="mt-auto">
                <p className="mb-1 text-xs opacity-80">{signal.displayTime}</p>
                <p className="text-sm">
                  Status:{" "}
                  <span className="font-semibold">{signal.displayStatus}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSignals.length === 0 && (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
          <p className="text-gray-500">No signals match the current filter</p>
        </div>
      )}
    </div>
  );
}
