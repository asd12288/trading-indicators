"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import type { Profile, Signal, BlogPost } from "@/types";

interface AdminDashboardClientProps {
  users: Profile[];
  signals: Signal[];
  posts: BlogPost[];
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
