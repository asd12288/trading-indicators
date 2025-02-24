"use client";

import useAlerts from "@/hooks/useAlerts";
import Link from "next/link";
import { DataTable } from "./admin/DataTable";
import { alertTableColumns } from "./alertTableColumns";

const AlertsTable = () => {
  const { alerts, isLoading } = useAlerts();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mb-8 p-8">
      <div className="rounded-lg bg-slate-800 p-8">
        <div className="flex items-center justify-between">
          <h2 className="mb-2 text-2xl font-semibold">All Alerts</h2>
          <Link href="/signals">
            <p className="text-xl font-medium hover:underline">
              Back to signals
            </p>
          </Link>
        </div>
        <DataTable data={alerts} columns={alertTableColumns} type="alerts" />
      </div>
    </div>
  );
};

export default AlertsTable;
