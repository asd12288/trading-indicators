import { Link } from "@/i18n/routing";
import { Signal } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertCircle, ArrowDownWideNarrow, Grid2X2, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useCallback, useMemo, useState } from "react";
import { Button } from "../ui/button";
import SignalCard from "./SignalCard";

interface SignalsGridProps {
  signals: Signal[];
  isLoading?: boolean;
}

// Create memoized SignalItem to prevent unnecessary re-renders
const SignalItem = memo(
  ({ signal, viewMode }: { signal: Signal; viewMode: string }) => (
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
        <SignalCard signalPassed={signal} />
      </div>
    </Link>
  ),
);

SignalItem.displayName = "SignalItem";

const SignalsGrid: React.FC<SignalsGridProps> = ({
  signals,
  isLoading = false,
}) => {
  // Always call hooks at the top, regardless of conditions
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<"default" | "name" | "time">(
    "default",
  );
  const t = useTranslations("SignalsGrid");

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
      }
      return 0; // Default order
    });
  }, [signals, sortOrder]);

  // Memoize sort order change handler
  const handleSortOrderChange = useCallback(() => {
    setSortOrder((current) => {
      switch (current) {
        case "default":
          return "name";
        case "name":
          return "time";
        default:
          return "default";
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
              {sortOrder === "default"
                ? t("sort")
                : sortOrder === "name"
                  ? t("sortByName")
                  : t("sortByTime")}
            </Button>
          </div>
        </div>

        {/* Grid/List View with simpler animation */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
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
          {sortedSignals.map((signal, index) => (
            <motion.div
              key={`${signal.instrument_name}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                delay: Math.min(index * 0.03, 0.3), // Cap delay to 300ms max
              }}
              className={viewMode === "list" ? "w-full" : "h-full"}
            >
              <SignalItem signal={signal} viewMode={viewMode} />
            </motion.div>
          ))}
        </motion.div>
      </>
    );
  }

  // Always return at the end after all hooks have been called
  return <div className="w-full space-y-6">{content}</div>;
};

export default SignalsGrid; // Don't use memo here to avoid nesting issues
