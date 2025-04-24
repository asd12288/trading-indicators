"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
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
  Menu,
  X,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Admin components
import AlertHoursManager from "@/components/admin/AlertHoursManager";
import BlogTable from "@/components/admin/BlogTable";
import InstrumentInfoTable from "@/components/admin/InstrumentInfoTable";
import SignalDebugTab from "@/components/admin/SignalDebugTab";
import SignalsMonitoring from "@/components/admin/SignalsMonitoring";
import SignalsTable from "@/components/admin/SignalsTable";
import UsersTable from "@/components/admin/UsersTable";
import NotificationsManager from "@/components/admin/NotificationsManager";

interface AdminLayoutProps {
  children?: React.ReactNode;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  users?: any[];
  signals?: any[];
  posts?: any[];
}

// Define tab groups with a unified structure
const TAB_GROUPS = [
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

export default function AdminLayout({
  children,
  activeTab,
  onTabChange,
  users = [],
  signals = [],
  posts = [],
}: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Initialize expanded groups and check for mobile screen
  useEffect(() => {
    // Initialize all groups as expanded initially
    const initialExpanded = TAB_GROUPS.reduce(
      (acc, group) => {
        acc[group.title] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    setExpandedGroups(initialExpanded);

    // Check if screen is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Monitor scroll position for styling
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleTabChange = (value: string) => {
    onTabChange(value);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Mobile Header */}
      <header
        className={cn(
          "fixed top-0 z-40 w-full border-b bg-slate-900 px-4 py-3 transition-all duration-200 md:hidden",
          scrolled ? "border-slate-700 shadow-md" : "border-transparent",
        )}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-300 hover:bg-slate-800"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4 pb-4"
          >
            {TAB_GROUPS.map((group) => (
              <div
                key={group.title}
                className="space-y-2 rounded-lg bg-slate-800/80 p-2"
              >
                <div
                  className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm font-medium text-slate-300"
                  onClick={() => toggleGroup(group.title)}
                >
                  {group.title}
                  {expandedGroups[group.title] ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </div>

                {expandedGroups[group.title] && (
                  <div className="space-y-1 pl-2">
                    {group.tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm",
                            activeTab === tab.id
                              ? "bg-blue-600 text-white"
                              : "bg-slate-700/50 text-slate-300 hover:bg-slate-700",
                          )}
                          onClick={() => handleTabChange(tab.id)}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </header>

      {/* Mobile spacer */}
      <div className="h-16 md:hidden"></div>

      {/* Desktop Header */}
      <header
        className={cn(
          "sticky top-0 z-30 hidden border-b border-slate-800/50 bg-slate-900 transition-all duration-200 md:block",
          scrolled ? "shadow-md" : "",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>

          <div className="scrollbar-hide mb-2 overflow-x-auto">
            <div className="flex min-w-max items-center gap-4 pb-2">
              {TAB_GROUPS.map((group, index) => (
                <div key={group.title} className="flex items-center">
                  {index > 0 && (
                    <div className="mx-2 h-6 w-px bg-slate-700/50"></div>
                  )}

                  <div className="flex items-center gap-1">
                    {group.tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleTabChange(tab.id)}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                            activeTab === tab.id
                              ? "bg-blue-600 text-white"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsContent
              value="users"
              className="rounded-lg bg-slate-800 p-6 shadow-lg"
            >
              <UsersTable users={users} />
            </TabsContent>

            <TabsContent
              value="signals"
              className="rounded-lg bg-slate-800 p-6 shadow-lg"
            >
              <SignalsTable signals={signals} />
            </TabsContent>

            <TabsContent
              value="blogs"
              className="rounded-lg bg-slate-800 p-6 shadow-lg"
            >
              <BlogTable posts={posts} />
            </TabsContent>

            <TabsContent
              value="notifications"
              className="rounded-lg bg-slate-800 p-6 shadow-lg"
            >
              <NotificationsManager />
            </TabsContent>

            <TabsContent
              value="instruments"
              className="rounded-lg bg-slate-800 p-6 shadow-lg"
            >
              <InstrumentInfoTable />
            </TabsContent>

            <TabsContent
              value="alert-hours"
              className="rounded-lg bg-slate-800 p-6 shadow-lg"
            >
              <AlertHoursManager />
            </TabsContent>

            <TabsContent
              value="debug"
              className="rounded-lg bg-slate-800 p-6 shadow-lg"
            >
              <SignalDebugTab />
            </TabsContent>

            <TabsContent
              value="monitoring"
              className="rounded-lg bg-slate-800 p-6 shadow-lg"
            >
              <SignalsMonitoring />
            </TabsContent>

            <TabsContent
              value="settings"
              className="rounded-lg bg-slate-800 p-6 shadow-lg"
            >
              <div>
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
    </div>
  );
}
