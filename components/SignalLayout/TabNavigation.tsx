"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Tab } from "./types";

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  theme: string;
  isPro: boolean;
}

export default function TabNavigation({
  tabs,
  activeTab,
  setActiveTab,
  theme,
  isPro,
}: TabNavigationProps) {
  return (
    <div className="scrollbar-hide mb-4 mt-6 overflow-x-auto">
      <div
        className={cn(
          "flex space-x-1 border-b",
          theme === "dark" ? "border-slate-700/50" : "border-slate-200",
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors duration-200",
              activeTab === tab.id
                ? "text-primary"
                : theme === "dark"
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-600 hover:text-slate-800",
            )}
          >
            <span className="flex items-center gap-2">
              {tab.icon} {tab.label}
              {tab.isPremium && !isPro && (
                <Lock size={12} className="text-amber-400" />
              )}
            </span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="bg-primary absolute bottom-0 left-0 h-0.5 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
