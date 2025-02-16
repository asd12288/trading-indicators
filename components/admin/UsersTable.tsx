// filepath: /c:/Users/ilanc/Desktop/indicators/app/admin/UsersPage.tsx
"use client";
import { DataTable } from "@/components/admin/DataTable";
import { userTableColumns } from "@/components/admin/UserTableColumns";

export default function UsersPage({ users }) {
  return (
    <div>
      <DataTable columns={userTableColumns} data={users} />
    </div>
  );
}
