import React, { useState, useMemo, memo, useCallback } from "react";
import { Signal } from "@/lib/types";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import usePreferences from "@/hooks/usePreferences";
import DashboardSignalCard from "./dashboard/DashboardSignalCard";
import DashboardHeader from "./dashboard/DashboardHeader";
import { toast } from "sonner";

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

interface FavoriteSignalsProps {
  favouriteSignals: Signal[];
  isLoading?: boolean;
  userId: string;
  onFavoriteRemoved?: (instrumentName: string) => void;
}

const FavoriteSignals: React.FC<FavoriteSignalsProps> = ({
  favouriteSignals,
  isLoading = false,
  userId,
  onFavoriteRemoved,
}) => {
  const [sortOption, setSortOption] = useState<
    "name" | "time" | "performance" | "status"
  >("status");

  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [columns, setColumns] = useState<2 | 3 | 4>(3);
  const router = useRouter();

  // Track locally removed signals to update UI immediately
  const [removedSignals, setRemovedSignals] = useState<string[]>([]);

  // Add updatePreference function from hook if userId is provided
  const { updatePreference } = usePreferences(userId);

  // Handle removing a signal from favorites
  const handleRemoveFavorite = useCallback(
    (instrumentName: string) => {
      if (!updatePreference) {
        toast.error("Unable to update preferences. Please try again.");
        return;
      }

      // Immediately update local state to reflect removal
      setRemovedSignals((prev) => [...prev, instrumentName]);

      // Notify parent component if callback exists
      if (onFavoriteRemoved) {
        onFavoriteRemoved(instrumentName);
      }

      updatePreference(instrumentName, { favorite: false })
        .then(() => {
          toast.success(
            `${instrumentName} has been removed from your favorites.`,
          );
        })
        .catch((error) => {
          console.error("Failed to remove favorite:", error);
          // Rollback local state if API call fails
          setRemovedSignals((prev) =>
            prev.filter((name) => name !== instrumentName),
          );

          toast.error(
            `Failed to remove ${instrumentName} from your favorites. Please try again.`,
          );
        });
    },
    [updatePreference, onFavoriteRemoved],
  );

  // Handle viewing signal details
  const handleViewDetails = useCallback(
    (instrumentName: string) => {
      router.push(`/smart-alerts/${instrumentName}`);
    },
    [router],
  );

  // Sort signals based on selected option AND filter out locally removed signals
  const sortedSignals = useMemo(() => {
    if (!favouriteSignals?.length) return [];

    return [...favouriteSignals]
      .filter((signal) => !removedSignals.includes(signal.instrument_name)) // Filter out removed signals
      .sort((a, b) => {
        if (sortOption === "name") {
          return a.instrument_name.localeCompare(b.instrument_name);
        } else if (sortOption === "performance") {
          // Sort by potential performance or actual results
          const aPerformance = a.exit_price
            ? a.trade_side === "BUY"
              ? a.exit_price - a.entry_price
              : a.entry_price - a.exit_price
            : a.trade_side === "BUY"
              ? a.take_profit_price - a.entry_price
              : a.entry_price - a.take_profit_price;

          const bPerformance = b.exit_price
            ? b.trade_side === "BUY"
              ? b.exit_price - b.entry_price
              : b.entry_price - b.exit_price
            : b.trade_side === "BUY"
              ? b.take_profit_price - b.entry_price
              : b.entry_price - b.take_profit_price;

          return bPerformance - aPerformance;
        } else if (sortOption === "status") {
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
        // Default: sort by time (newest first)
        return (
          new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime()
        );
      });
  }, [favouriteSignals, sortOption, removedSignals]);

  // Handle empty state
  if (!isLoading && (!sortedSignals || sortedSignals.length === 0)) {
    return null;
  }

  return (
    <div className="dashboard-container text-slate-200">
      <div className="mb-5">
        {/* Dashboard header - now extracted to component */}
        <DashboardHeader
          title="My Signal Dashboard"
          description="Your favorite signals at a glance"
          count={sortedSignals.length}
          layout={layout}
          setLayout={setLayout}
          columns={columns}
          setColumns={setColumns}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />

        {/* Grid or list layout for signals based on user preference */}
        {layout === "grid" ? (
          <div
            className={cn(
              "grid gap-5",
              columns === 2
                ? "grid-cols-1 md:grid-cols-2"
                : columns === 3
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            )}
          >
            {isLoading
              ? // Loading skeletons
                Array(columns)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={`skeleton-${idx}`}
                      className="h-[400px] animate-pulse rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 shadow-md"
                    >
                      <div className="mb-2 h-6 w-4/5 rounded-md bg-slate-700"></div>
                      <div className="mb-4 h-[320px] rounded-md bg-slate-700/60"></div>
                    </div>
                  ))
              : sortedSignals.map((signal) => (
                  <DashboardSignalCard
                    key={signal.instrument_name}
                    signal={signal}
                    layout="grid"
                    onRemoveFavorite={handleRemoveFavorite}
                    onViewDetails={handleViewDetails}
                  />
                ))}
          </div>
        ) : (
          <div className="hide-scrollbar flex space-x-4 overflow-x-auto pb-4 pt-1">
            {isLoading
              ? // Loading skeletons for list view
                Array(3)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={`skeleton-${idx}`}
                      className="min-w-[350px] max-w-[350px] animate-pulse rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 shadow-md"
                    >
                      <div className="mb-2 h-6 w-4/5 rounded-md bg-slate-700"></div>
                      <div className="mb-4 h-[300px] rounded-md bg-slate-700"></div>
                    </div>
                  ))
              : sortedSignals.map((signal) => (
                  <DashboardSignalCard
                    key={signal.instrument_name}
                    signal={signal}
                    layout="list"
                    onRemoveFavorite={handleRemoveFavorite}
                    onViewDetails={handleViewDetails}
                  />
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(FavoriteSignals);
