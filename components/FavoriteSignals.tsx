import React, { useState, useMemo, memo } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowUpDown,
} from "lucide-react";
import { motion } from "framer-motion";
import SignalCard from "./SignalCard/SignalCard";
import { Signal } from "@/lib/types";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
}

// Optimize container for better scrolling
const ScrollContainer = memo(({ children, onScrollLeft, onScrollRight }) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Expose scroll methods to parent
  React.useImperativeHandle(
    { current: { scrollLeft: onScrollLeft, scrollRight: onScrollRight } },
    () => ({
      scrollLeft: () => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollBy({
            left: -300,
            behavior: "smooth",
          });
        }
      },
      scrollRight: () => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollBy({
            left: 300,
            behavior: "smooth",
          });
        }
      },
    }),
    [onScrollLeft, onScrollRight],
  );

  return (
    <div
      ref={scrollContainerRef}
      className="hide-scrollbar flex space-x-4 overflow-x-auto pb-4 pt-1"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {children}
    </div>
  );
});

ScrollContainer.displayName = "ScrollContainer";

const FavoriteSignals: React.FC<FavoriteSignalsProps> = ({
  favouriteSignals,
  isLoading = false,
}) => {
  const [sortOption, setSortOption] = useState<
    "name" | "time" | "performance" | "status"
  >(
    "status", // Changed default to status
  );

  // Scroll handlers
  const handleScrollLeft = () => {
    const container = document.getElementById("favorites-scroll-container");
    if (container) {
      container.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    const container = document.getElementById("favorites-scroll-container");
    if (container) {
      container.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  // Sort signals based on selected option
  const sortedSignals = useMemo(() => {
    if (!favouriteSignals?.length) return [];

    return [...favouriteSignals].sort((a, b) => {
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
  }, [favouriteSignals, sortOption]);

  // Handle empty state
  if (!isLoading && (!favouriteSignals || favouriteSignals.length === 0)) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          <h3 className="text-lg font-medium text-white">Favorite Signals</h3>
          <Badge className="bg-yellow-500/20 text-yellow-200">
            {favouriteSignals.length}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-700 bg-slate-800/70 text-xs hover:bg-slate-700"
              >
                <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
                Sort:{" "}
                {sortOption === "time"
                  ? "Recent"
                  : sortOption === "name"
                    ? "Name"
                    : sortOption === "status"
                      ? "Status"
                      : "Performance"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-slate-800 text-slate-200"
            >
              <DropdownMenuItem
                onClick={() => setSortOption("status")}
                className="hover:bg-slate-700"
              >
                Status
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption("time")}
                className="hover:bg-slate-700"
              >
                Recent
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption("name")}
                className="hover:bg-slate-700"
              >
                Name
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption("performance")}
                className="hover:bg-slate-700"
              >
                Performance
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Navigation arrows */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 rounded-full border-slate-700 bg-slate-800 p-0 hover:bg-slate-700"
              onClick={handleScrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 rounded-full border-slate-700 bg-slate-800 p-0 hover:bg-slate-700"
              onClick={handleScrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontally scrollable container with full signal cards */}
      <div className="relative">
        <div
          id="favorites-scroll-container"
          className="hide-scrollbar flex space-x-4 overflow-x-auto pb-4 pt-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading
            ? // Loading skeletons
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
                <div
                  key={signal.instrument_name}
                  className="relative min-w-[350px] max-w-[350px] rounded-xl border-2 border-yellow-500/20 shadow-md transition-all hover:border-yellow-500/40 hover:shadow-yellow-400/10"
                >
                  {/* Star icon to indicate favorite */}
                  <div className="absolute -right-2 -top-2 z-10">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </div>

                  <Link
                    href={`/smart-alerts/${signal.instrument_name}`}
                    className="block h-full w-full"
                  >
                    <div className="p-2">
                      <SignalCard signalPassed={signal} />
                    </div>
                  </Link>
                </div>
              ))}
        </div>

        {/* Gradient fades for scroll indication */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-8 bg-gradient-to-r from-slate-900 to-transparent"></div>
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-8 bg-gradient-to-l from-slate-900 to-transparent"></div>
      </div>
    </div>
  );
};

export default memo(FavoriteSignals);
