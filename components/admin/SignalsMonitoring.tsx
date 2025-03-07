"use client";
import React, { useState } from "react";
import { useSignalsStatus } from "@/hooks/useSignalsStatus";
import AdminMaintenance from "./AdminMaintenance";
import {
  ChartBarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ClockIcon,
  XCircleIcon,
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

  // Function to determine status properties
  const getStatusProperties = (signal) => {
    if (signal.position_status === "ACTIVE") {
      return {
        borderColor: "border-green-500",
        bgColor: "bg-slate-800",
        textColor: "text-green-400",
        icon: <CheckCircleIcon className="h-5 w-5 text-green-400" />,
        statusBadgeColor: "bg-green-900 text-green-300",
      };
    } else if (signal.position_status === "PENDING") {
      return {
        borderColor: "border-yellow-500",
        bgColor: "bg-slate-800",
        textColor: "text-yellow-400",
        icon: <ClockIcon className="h-5 w-5 text-yellow-400" />,
        statusBadgeColor: "bg-yellow-900 text-yellow-300",
      };
    } else if (
      signal.displayStatus.includes("Error") ||
      signal.displayStatus.includes("Failed")
    ) {
      return {
        borderColor: "border-red-500",
        bgColor: "bg-slate-800",
        textColor: "text-red-400",
        icon: <XCircleIcon className="h-5 w-5 text-red-400" />,
        statusBadgeColor: "bg-red-900 text-red-300",
      };
    }

    return {
      borderColor: "border-slate-600",
      bgColor: "bg-slate-800",
      textColor: "text-slate-300",
      icon: null,
      statusBadgeColor: "bg-slate-700 text-slate-300",
    };
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
      <div className="bg-slate-900 p-4 text-slate-200 md:p-6">
        <div className="mb-6 flex items-center">
          <ChartBarIcon className="mr-2 h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-slate-100">
            Status Monitoring
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-md"
            >
              <div className="mb-4 h-6 w-3/4 rounded bg-slate-700"></div>
              <div className="mb-3 h-4 w-1/2 rounded bg-slate-700"></div>
              <div className="mt-4 h-5 w-2/3 rounded bg-slate-700"></div>
              <div className="mt-2 flex justify-between">
                <div className="h-4 w-1/3 rounded bg-slate-700"></div>
                <div className="h-4 w-1/3 rounded bg-slate-700"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-red-600 bg-slate-800 p-6 shadow-md">
        <ExclamationCircleIcon className="mb-4 h-12 w-12 text-red-500" />
        <h3 className="mb-2 text-xl font-semibold text-red-400">
          Error Loading Signals
        </h3>
        <p className="mb-4 text-center text-red-300">{error}</p>
        <button
          className="flex items-center rounded-md bg-blue-800 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          <ArrowPathIcon className="mr-2 h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl bg-slate-900 p-4 text-slate-200 md:p-6">
      <AdminMaintenance />

      <div className="my-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center">
            <ChartBarIcon className="mr-2 h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-slate-100">
              Status Monitoring
            </h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-700 text-white shadow-md"
                  : "border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              All ({summaryCounts.total})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                filter === "active"
                  ? "bg-green-700 text-white shadow-md"
                  : "border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Active ({summaryCounts.active})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                filter === "pending"
                  ? "bg-yellow-700 text-white shadow-md"
                  : "border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Pending ({summaryCounts.pending})
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm font-medium text-slate-400">Total Signals</p>
            <p className="text-3xl font-bold text-slate-200">
              {summaryCounts.total}
            </p>
            <div className="mt-2 h-1 w-full rounded-full bg-slate-700">
              <div className="h-1 w-full rounded-full bg-blue-600"></div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm font-medium text-green-400">Active</p>
            <p className="text-3xl font-bold text-green-300">
              {summaryCounts.active}
            </p>
            <div className="mt-2 h-1 w-full rounded-full bg-slate-700">
              <div
                className="h-1 rounded-full bg-green-600"
                style={{
                  width: `${(summaryCounts.active / summaryCounts.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm font-medium text-yellow-400">Pending</p>
            <p className="text-3xl font-bold text-yellow-300">
              {summaryCounts.pending}
            </p>
            <div className="mt-2 h-1 w-full rounded-full bg-slate-700">
              <div
                className="h-1 rounded-full bg-yellow-600"
                style={{
                  width: `${(summaryCounts.pending / summaryCounts.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm font-medium text-red-400">Errors</p>
            <p className="text-3xl font-bold text-red-300">
              {summaryCounts.error}
            </p>
            <div className="mt-2 h-1 w-full rounded-full bg-slate-700">
              <div
                className="h-1 rounded-full bg-red-600"
                style={{
                  width: `${(summaryCounts.error / summaryCounts.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSignals.map((signal) => {
          const { borderColor, bgColor, textColor, icon, statusBadgeColor } =
            getStatusProperties(signal);

          return (
            <div
              key={signal.id}
              className={`rounded-lg border-l-4 ${borderColor} ${bgColor} p-5 shadow-md transition-all hover:shadow-lg`}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className={`truncate text-lg font-semibold ${textColor}`}>
                  {signal.instrument_name}
                </h3>
                {icon}
              </div>

              <div className="flex flex-col">
                <div
                  className={`mb-3 inline-block self-start rounded-full ${statusBadgeColor} px-3 py-1 text-xs font-medium`}
                >
                  {signal.position_status}
                </div>
                <div className="mt-auto space-y-2">
                  <p className="text-xs text-slate-400">{signal.displayTime}</p>
                  <p className={`text-sm ${textColor}`}>
                    Status:{" "}
                    <span className="font-medium">{signal.displayStatus}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSignals.length === 0 && (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-800">
          <p className="text-slate-400">No signals match the current filter</p>
          <button
            onClick={() => setFilter("all")}
            className="mt-2 text-blue-400 hover:text-blue-300 hover:underline"
          >
            Show all signals
          </button>
        </div>
      )}
    </div>
  );
}
