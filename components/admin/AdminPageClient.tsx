"use client";

import { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminPageClient({
  children,
  initialTab = "signals",
}: {
  children: React.ReactNode;
  initialTab?: string;
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {children}
    </AdminLayout>
  );
}
