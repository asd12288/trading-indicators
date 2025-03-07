import { Link } from "@/i18n/routing";
import SignalCard from "./SignalCard";
import { Signal } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Grid2X2, List, AlertCircle, ArrowDownWideNarrow } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface SignalsGridProps {
  signals: Signal[];
  isLoading?: boolean;
}

const SignalsGrid: React.FC<SignalsGridProps> = ({
  signals,
  isLoading = false,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<"default" | "name" | "time">(
    "default",
  );
  const t = useTranslations("SignalsGrid");

  // Sort signals based on selected order
  const sortedSignals = [...signals].sort((a, b) => {
    if (sortOrder === "name") {
      return a.instrument_name.localeCompare(b.instrument_name);
    } else if (sortOrder === "time") {
      return (
        new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
      );
    }
    return 0; // Default order
  });

  // Handle empty state
  if (!isLoading && signals.length === 0) {
    return (
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-800/50 p-8 text-center">
        <AlertCircle className="mb-3 h-12 w-12 text-slate-500" />
        <h3 className="mb-1 text-xl font-medium text-slate-300">
          {t("noSignals")}
        </h3>
        <p className="text-sm text-slate-400">{t("noSignalsDescription")}</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Controls bar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-800/80 p-3 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-400">
            {t("viewing")}:{" "}
          </span>
          <span className="rounded bg-slate-700 px-2.5 py-1 text-sm font-medium text-slate-200">
            {signals.length} {signals.length === 1 ? t("signal") : t("signals")}
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
              onClick={() => setViewMode("grid")}
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
              onClick={() => setViewMode("list")}
              title={t("listView")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 border-slate-700 bg-slate-900/80 text-xs font-medium hover:bg-slate-800"
            onClick={() => {
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
            }}
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

      {/* Grid/List View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "w-full",
            viewMode === "grid"
              ? "grid gap-4 rounded-lg bg-slate-800/40 p-4 md:gap-5 md:p-5 lg:gap-6 lg:p-6"
              : "space-y-4 rounded-lg bg-slate-800/40 p-4 md:p-5 lg:p-6",
            viewMode === "grid" &&
              "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          )}
          style={{
            gridAutoRows:
              viewMode === "grid" ? "minmax(min-content, 1fr)" : "auto",
          }}
        >
          {sortedSignals.map((signal, index) => (
            <motion.div
              key={`${signal.instrument_name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeOut",
              }}
              className={viewMode === "list" ? "w-full" : "h-full"}
            >
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
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SignalsGrid;
