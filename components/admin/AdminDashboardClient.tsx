"use client";

import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/AdminHeader";

// Admin components
import AlertHoursManager from "@/components/admin/AlertHoursManager";
import BlogTable from "@/components/admin/BlogTable";
import InstrumentInfoTable from "@/components/admin/InstrumentInfoTable";
import SendNotificationForm from "@/components/admin/SendNotificationForm";
import SignalDebugTab from "@/components/admin/SignalDebugTab";
import SignalsMonitoring from "@/components/admin/SignalsMonitoring";
import SignalsTable from "@/components/admin/SignalsTable";
import UsersTable from "@/components/admin/UsersTable";

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
    <div className="min-h-screen bg-slate-900">
      <AdminHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="users" className="mt-6 pt-2">
            <UsersTable users={users} />
          </TabsContent>

          <TabsContent value="signals" className="mt-6 pt-2">
            <SignalsTable signals={signals} />
          </TabsContent>

          <TabsContent value="blogs" className="mt-6 pt-2">
            <BlogTable posts={posts} />
          </TabsContent>

          <TabsContent value="instruments" className="mt-6 pt-2">
            <InstrumentInfoTable />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 pt-2">
            <div className="space-y-6">
              <SendNotificationForm />
            </div>
          </TabsContent>

          <TabsContent value="alert-hours" className="mt-6 pt-2">
            <AlertHoursManager />
          </TabsContent>

          <TabsContent value="debug" className="mt-6 pt-2">
            <SignalDebugTab />
          </TabsContent>

          <TabsContent value="monitoring" className="mt-6 pt-2">
            <SignalsMonitoring />
          </TabsContent>

          <TabsContent value="settings" className="mt-6 pt-2">
            <div className="rounded-lg border border-slate-700 bg-slate-900 p-6">
              <h2 className="mb-4 text-xl font-bold text-slate-200">
                System Settings
              </h2>
              <p className="text-slate-400">
                System settings will be available in a future update.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
