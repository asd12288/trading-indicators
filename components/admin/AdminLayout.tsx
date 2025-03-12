"use client";

import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import AdminTabNavigation from "./AdminTabNavigation";
import {
  Users,
  BarChart3,
  FileText,
  Settings,
  Bell,
  Clock,
  Binary,
  Database,
  Layers3,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function AdminLayout({
  children,
  activeTab,
  onTabChange,
}: AdminLayoutProps) {
  const tabGroups = [
    {
      title: "Trading Data",
      tabs: [
        { id: "signals", label: "Signals", icon: BarChart3 },
        { id: "instruments", label: "Instruments", icon: Database },
        { id: "alert-hours", label: "Alert Hours", icon: Clock },
      ],
    },
    {
      title: "Content & Users",
      tabs: [
        { id: "users", label: "Users", icon: Users },
        { id: "blogs", label: "Blogs", icon: FileText },
        { id: "notifications", label: "Notifications", icon: Bell },
      ],
    },
    {
      title: "System & Debugging",
      tabs: [
        { id: "monitoring", label: "Monitoring", icon: Layers3 },
        { id: "debug", label: "Signal Debug", icon: Binary },
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-4 rounded-lg bg-slate-800 p-4 shadow-lg">
              <AdminTabNavigation
                groups={tabGroups}
                activeTab={activeTab}
                onTabChange={onTabChange}
              />
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-9">
            <div className="rounded-lg bg-slate-800 p-6 shadow-lg">
              <Tabs value={activeTab} onValueChange={onTabChange}>
                {children}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
