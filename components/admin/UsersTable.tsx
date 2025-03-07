// filepath: /c:/Users/ilanc/Desktop/indicators/app/admin/UsersPage.tsx
"use client";
import { DataTable } from "@/components/admin/DataTable";
import { userTableColumns } from "@/components/admin/UserTableColumns";
import { motion } from "framer-motion";
import { UsersIcon } from "lucide-react";

export default function UsersPage({ users }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-900/30 p-3">
            <UsersIcon className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Users Management</h1>
            <p className="text-slate-400">
              Manage user accounts and permissions
            </p>
          </div>
        </div>
        <div className="rounded-lg bg-slate-700/50 px-4 py-2 text-sm">
          <span className="font-medium text-slate-300">Total Users: </span>
          <span className="text-white">{users?.length || 0}</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/80 shadow-lg">
        <DataTable columns={userTableColumns} data={users} type="users" />
      </div>
    </motion.div>
  );
}
