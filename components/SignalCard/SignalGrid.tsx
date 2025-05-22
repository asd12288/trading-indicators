"use client";

import { Link } from "@/i18n/routing";
import { Signal } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertCircle, ArrowDownWideNarrow, Grid2X2, List } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useCallback, useMemo, useState } from "react";
import { Button } from "../ui/button";
import SignalCard from "./SignalCard";
import { useUser } from "@/providers/UserProvider";

// Helper function to determine signal status priority
const getSignalStatusPriority = (signal: Signal): number => {
  // Running signals (have entry_time but no exit_time)
  if (signal.entry_time && !signal.exit_time) {
    return 1; // Highest priority
  }
  // Fulfilled signals (have both entry_time and exit_time)
  else if (signal.entry_time && signal.exit_time) {
    return 2; // Medium priority
  }
  // Market closed signals (default to lowest priority)
  else {
    return 3; // Lowest priority
  }
};

interface SignalsGridProps {
  signals: Signal[];
  isLoading?: boolean;
}

// SignalItem component now re-renders on every update
const SignalItem: React.FC<{ signal: Signal; viewMode: string }> = ({
  signal,
  viewMode,
}) => {
  // Get current user ID from user provider
  const { user } = useUser();

  return (
    <Link
      className={cn(
        "block h-full w-full transition-all duration-300",
        viewMode === "grid"
          ? "transform rounded-xl hover:translate-y-[-4px] hover:shadow-xl hover:shadow-blue-500/20"
          : "transform rounded-xl hover:bg-slate-700/40",
      )}
      href={`smart-alerts/${signal.instrument_name}`}
    >
      <div
        className={cn(
          viewMode === "list" ? "w-full" : "h-full",
          "overflow-hidden rounded-xl",
        )}
      >
        <SignalCard
          signalPassed={signal}
          userId={user?.id} // Pass user ID from user provider
        />
      </div>
    </Link>
  );
};

SignalItem.displayName = "SignalItem";

// Memoized SignalItem to only re-render when signal props change
const MemoSignalItem = React.memo(SignalItem, (prevProps, nextProps) => {
  return (
    prevProps.signal.client_trade_id === nextProps.signal.client_trade_id &&
    prevProps.signal.entry_time === nextProps.signal.entry_time &&
    prevProps.signal.exit_time === nextProps.signal.exit_time &&
    prevProps.signal.take_profit_price === nextProps.signal.take_profit_price &&
    prevProps.signal.stop_loss_price === nextProps.signal.stop_loss_price &&
    prevProps.viewMode === nextProps.viewMode
  );
});

const SignalsGrid: React.FC<SignalsGridProps> = ({
  signals,
  isLoading = false,
}) => {
  // Always call hooks at the top, regardless of conditions
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<
    "default" | "name" | "time" | "status"
  >(
    "status", // Changed default to "status" to prioritize by signal state
  );
  const t = useTranslations("SignalsGrid");
  const { user } = useUser();

  // Memoize sorted signals to prevent re-sorting on every render
  const sortedSignals = useMemo(() => {
    if (!signals || signals.length === 0) return [];

    return [...signals].sort((a, b) => {
      if (sortOrder === "name") {
        return a.instrument_name.localeCompare(b.instrument_name);
      } else if (sortOrder === "time") {
        return (
          new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
        );
      } else if (sortOrder === "status" || sortOrder === "default") {
        // Sort by status priority first
        const statusCompare =
          getSignalStatusPriority(a) - getSignalStatusPriority(b);
        if (statusCompare !== 0) {
          return statusCompare;
        }

        // For signals with same status, sort by time (newest first within each category)
        return (
          new Date(b.entry_time || new Date()).getTime() -
          new Date(a.entry_time || new Date()).getTime()
        );
      }
      return 0;
    });
  }, [signals, sortOrder]);

  // Memoize sort order change handler
  const handleSortOrderChange = useCallback(() => {
    setSortOrder((current) => {
      switch (current) {
        case "status":
          return "name";
        case "name":
          return "time";
        case "time":
          return "status";
        default:
          return "status";
      }
    });
  }, []);

  // Optimize view mode switching
  const setGridView = useCallback(() => setViewMode("grid"), []);
  const setListView = useCallback(() => setViewMode("list"), []);

  // Instead of early return, use conditional rendering
  let content;

  if (!isLoading && signals.length === 0) {
    content = (
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-800/50 p-8 text-center">
        <AlertCircle className="mb-3 h-12 w-12 text-slate-500" />
        <h3 className="mb-1 text-xl font-medium text-slate-300">
          {t("noSignals")}
        </h3>
        <p className="text-sm text-slate-400">{t("noSignalsDescription")}</p>
      </div>
    );
  } else {
    content = (
      <>
        {/* Controls bar */}
        <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-800/80 p-3 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-400">
              {t("viewing")}:{" "}
            </span>
            <span className="rounded bg-slate-700 px-2.5 py-1 text-sm font-medium text-slate-200">
              {signals.length}{" "}
              {signals.length === 1 ? t("signal") : t("signals")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-md bg-slate-900/80 p-1.5 shadow-inner">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 w-9 rounded-md p-0",
                  viewMode === "grid" ? "bg-slate-700" : "hover:bg-slate-800",
                )}
                onClick={setGridView}
                title={t("gridView")}
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 w-9 rounded-md p-0",
                  viewMode === "list" ? "bg-slate-700" : "hover:bg-slate-800",
                )}
                onClick={setListView}
                title={t("listView")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 border-slate-700 bg-slate-900/80 text-xs font-medium hover:bg-slate-800"
              onClick={handleSortOrderChange}
            >
              <ArrowDownWideNarrow className="h-3.5 w-3.5" />
              {sortOrder === "status"
                ? t("sortByStatus") || "Sort by Status"
                : sortOrder === "name"
                  ? t("sortByName")
                  : t("sortByTime")}
            </Button>
          </div>
        </div>

        {/* Grid/List View with simpler animation */}
        <div
          className={cn(
            "w-full",
            viewMode === "grid"
              ? "grid gap-4 rounded-lg bg-slate-800/40 p-4 md:gap-5 md:p-5 lg:gap-6 lg:p-6"
              : "space-y-4 rounded-lg bg-slate-800/40 p-4 md:p-5 lg:p-6",
            viewMode === "grid" && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          )}
          style={{
            gridAutoRows:
              viewMode === "grid" ? "minmax(min-content, 1fr)" : "auto",
          }}
        >
          {sortedSignals.map((signal) => (
            <div
              key={signal.client_trade_id}
              className={viewMode === "list" ? "w-full" : "h-full"}
            >
              <MemoSignalItem signal={signal} viewMode={viewMode} />
            </div>
          ))}
        </div>
      </>
    );
  }

  // Always return at the end after all hooks have been called
  return <div className="w-full space-y-6">{content}</div>;
};

export default SignalsGrid; // Don't use memo here to avoid nesting issues
