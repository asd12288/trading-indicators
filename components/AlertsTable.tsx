"use client";

import useAlerts from "@/hooks/useAlerts";
import { DataTable } from "./admin/DataTable";
import { alertTableColumns } from "./alertTableColumns";
import { Link } from "@/i18n/routing";

const AlertsTable = () => {
  const { alerts, isLoading, error } = useAlerts();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">Error: {error}</div>;
  }

  return (
    <div className="mb-8 p-8">
      <div className="rounded-lg bg-slate-800 p-8">
        <div className="flex items-center justify-between">
          <h2 className="mb-2 text-2xl font-semibold">All Alerts</h2>
          <Link href="/smart-alerts">
            <p className="text-xl font-medium hover:underline">
              Back to signals
            </p>
          </Link>
        </div>
        {alerts.length > 0 ? (
          <DataTable data={alerts} columns={alertTableColumns} type="alerts" />
        ) : (
          <p className="text-center text-gray-400">No alerts available.</p>
        )}
      </div>
    </div>
  );
};

export default AlertsTable;
