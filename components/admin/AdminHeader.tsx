"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";

// Import icons
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

const tabGroups = [
  {
    name: "Trading Data",
    tabs: [
      { id: "signals", label: "Signals", icon: BarChart3 },
      { id: "instruments", label: "Instruments", icon: Database },
      { id: "alert-hours", label: "Alert Hours", icon: Clock },
    ],
  },
  {
    name: "Content & Users",
    tabs: [
      { id: "users", label: "Users", icon: Users },
      { id: "blogs", label: "Blogs", icon: FileText },
      { id: "notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    name: "System",
    tabs: [
      { id: "monitoring", label: "Monitoring", icon: Layers3 },
      { id: "debug", label: "Debug", icon: Binary },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

// Flatten all tabs for search and access
const allTabs = tabGroups.flatMap((group) => group.tabs);

interface AdminHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export default function AdminHeader({ activeTab, onTabChange }: AdminHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  
  // Monitor scroll position for styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabChange = (value: string) => {
    onTabChange(value);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu */}
      <div className="md:hidden">
        <div
          className={cn(
            "fixed top-0 z-40 w-full border-b bg-slate-900 px-4 py-3 transition-all duration-200",
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
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {mobileMenuOpen && (
            <div className="mt-4 space-y-4 pb-4">
              {tabGroups.map((group) => (
                <div key={group.name} className="space-y-2">
                  <div
                    className="flex cursor-pointer items-center justify-between rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300"
                    onClick={() =>
                      setShowGroupDropdown((prev) =>
                        prev === group.name ? null : group.name,
                      )
                    }
                  >
                    {group.name}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        showGroupDropdown === group.name ? "rotate-180" : "",
                      )}
                    />
                  </div>

                  {showGroupDropdown === group.name && (
                    <div className="ml-2 space-y-1 pl-2">
                      <Tabs value={activeTab} onValueChange={handleTabChange}>
                        <TabsList className="flex flex-col space-y-1 bg-transparent">
                          {group.tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                              <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className={cn(
                                  "flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-left",
                                  activeTab === tab.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-800/50 text-slate-300 hover:bg-slate-800",
                                )}
                              >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                              </TabsTrigger>
                            );
                          })}
                        </TabsList>
                      </Tabs>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add spacer for fixed header */}
        <div className="h-14"></div>
      </div>

      {/* Desktop header */}
      <header
        className={cn(
          "sticky top-0 z-30 hidden bg-slate-900 transition-all duration-200 md:block",
          scrolled ? "shadow-md" : "",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-2 w-full bg-slate-800/70 p-1 backdrop-blur-sm">
              {tabGroups.map((group) => (
                <div key={group.name} className="flex items-center">
                  {group !== tabGroups[0] && (
                    <div className="mx-2 h-6 w-px bg-slate-700"></div>
                  )}

                  {group.tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="flex items-center gap-2 data-[state=active]:bg-blue-600"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </div>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </header>
    </>
  );
}
