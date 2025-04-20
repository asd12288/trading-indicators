"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

interface AdminDashboardClientProps {
  users: any[];
  signals: any[];
  posts: any[];
}

export default function AdminDashboardClient({
  users,
  signals,
  posts,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState("signals");

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      users={users}
      signals={signals}
      posts={posts}
    />
  );
}
