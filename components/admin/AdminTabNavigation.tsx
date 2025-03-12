"use client";

import { useEffect, useState } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface TabGroup {
  title: string;
  tabs: {
    id: string;
    label: string;
    icon: LucideIcon;
  }[];
}

interface AdminTabNavigationProps {
  groups: TabGroup[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function AdminTabNavigation({
  groups,
  activeTab,
  onTabChange,
}: AdminTabNavigationProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const [isMobile, setIsMobile] = useState(false);

  // Initialize all groups as expanded
  useEffect(() => {
    const initialExpanded = groups.reduce(
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

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [groups]);

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.title} className="rounded-lg bg-slate-800 p-2">
          <div
            className="flex cursor-pointer items-center justify-between px-4 py-2"
            onClick={() => toggleGroup(group.title)}
          >
            <h3 className="text-sm font-medium text-slate-300">
              {group.title}
            </h3>
            {expandedGroups[group.title] ? (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-400" />
            )}
          </div>

          {expandedGroups[group.title] && (
            <TabsList
              className={cn(
                "mt-2 grid w-full gap-2 rounded-md bg-slate-700 p-2",
                isMobile ? "grid-cols-3" : "grid-cols-auto-fit",
              )}
            >
              {group.tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2",
                      activeTab === tab.id
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700",
                    )}
                    onClick={() => onTabChange(tab.id)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className={isMobile ? "hidden" : "inline"}>
                      {tab.label}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          )}
        </div>
      ))}
    </div>
  );
}
