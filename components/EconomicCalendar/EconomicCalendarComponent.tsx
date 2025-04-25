"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import type { EconomicEvent } from "@/services/finnhub";

interface EconomicCalendarProps {
  events?: EconomicEvent[];
  isLoading?: boolean;
  daysAhead?: number;
  showLoader?: boolean;
}

export default function EconomicCalendarComponent({
  events: initialEvents,
  isLoading: initialLoading = false,
  daysAhead = 7,
  showLoader = true,
}: EconomicCalendarProps) {
  const { theme } = useTheme();
  const [events, setEvents] = useState<EconomicEvent[]>(initialEvents || []);
  const [isLoading, setIsLoading] = useState(initialLoading || !initialEvents);
  const [error, setError] = useState<string | null>(null);

  // Fetch economic calendar events from our server API if not provided as props
  useEffect(() => {
    if (initialEvents) {
      setEvents(initialEvents);
      return;
    }

    const fetchEconomicEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const today = new Date().toISOString().split("T")[0];
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);
        const endDate = futureDate.toISOString().split("T")[0];

        // Call our server-side API endpoint
        const response = await fetch(
          `/api/economic-calendar?from=${today}&to=${endDate}`,
        );

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error("Error fetching economic calendar:", err);
        setError("Failed to load economic calendar data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEconomicEvents();
  }, [initialEvents, daysAhead]);

  // Format a date string from the API (YYYY-MM-DD)
  const formatDate = (dateStr: string, timeStr?: string) => {
    try {
      const date = new Date(dateStr);
      return timeStr
        ? `${format(date, "MMM d, yyyy")} ${timeStr}`
        : format(date, "MMM d, yyyy");
    } catch (error) {
      return dateStr;
    }
  };

  // Get the appropriate color based on impact level
  const getImpactColor = (impact: string) => {
    const impactLower = impact.toLowerCase();
    if (impactLower.includes("high")) return "bg-red-600 text-white";
    if (impactLower.includes("medium")) return "bg-amber-500 text-white";
    return "bg-blue-500 text-white";
  };

  // Group events by date
  const groupedEvents = events.reduce<Record<string, EconomicEvent[]>>(
    (acc, event) => {
      const date = event.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    },
    {},
  );

  if (isLoading && showLoader) {
    return (
      <div className="my-12 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-amber-500">{error}</div>;
  }

  if (!events || events.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400">
        No upcoming economic events found.
      </div>
    );
  }

  const tableCellClass = cn(
    "text-sm",
    theme === "dark" ? "text-slate-300" : "text-slate-800",
  );

  return (
    <div className="overflow-auto">
      <Table>
        <TableCaption
          className={cn(theme === "dark" ? "text-slate-400" : "text-slate-600")}
        >
          Upcoming Economic Events
        </TableCaption>
        <TableHeader
          className={cn(theme === "dark" ? "bg-slate-800/70" : "bg-slate-50")}
        >
          <TableRow>
            <TableHead
              className={cn(
                "w-[180px]",
                theme === "dark" ? "text-slate-200" : "text-slate-800",
              )}
            >
              Date
            </TableHead>
            <TableHead
              className={cn(
                theme === "dark" ? "text-slate-200" : "text-slate-800",
              )}
            >
              Country
            </TableHead>
            <TableHead
              className={cn(
                "w-[300px]",
                theme === "dark" ? "text-slate-200" : "text-slate-800",
              )}
            >
              Indicator
            </TableHead>
            <TableHead
              className={cn(
                theme === "dark" ? "text-slate-200" : "text-slate-800",
              )}
            >
              Forecast
            </TableHead>
            <TableHead
              className={cn(
                theme === "dark" ? "text-slate-200" : "text-slate-800",
              )}
            >
              Actual
            </TableHead>
            <TableHead
              className={cn(
                theme === "dark" ? "text-slate-200" : "text-slate-800",
              )}
            >
              Previous
            </TableHead>
            <TableHead
              className={cn(
                theme === "dark" ? "text-slate-200" : "text-slate-800",
              )}
            >
              Impact
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <React.Fragment key={date}>
              {dateEvents.map((event, index) => (
                <TableRow
                  key={`${date}-${index}`}
                  className={cn(
                    "transition-colors",
                    theme === "dark"
                      ? "hover:bg-slate-800/80"
                      : "hover:bg-slate-50",
                  )}
                >
                  {index === 0 && (
                    <TableCell
                      rowSpan={dateEvents.length}
                      className={cn(
                        "font-medium",
                        tableCellClass,
                        theme === "dark"
                          ? "bg-slate-800/70 text-slate-200"
                          : "bg-slate-50 text-slate-800",
                      )}
                    >
                      {formatDate(date)}
                    </TableCell>
                  )}
                  <TableCell className={tableCellClass}>
                    {event.country}
                  </TableCell>
                  <TableCell className={tableCellClass}>
                    {event.indicator || event.period}
                  </TableCell>
                  <TableCell className={tableCellClass}>
                    {event.forecast ?? "N/A"}
                  </TableCell>
                  <TableCell className={tableCellClass}>
                    {event.actual ?? "N/A"}
                  </TableCell>
                  <TableCell className={tableCellClass}>
                    {event.previous ?? "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getImpactColor(event.impact || "Low")}>
                      {event.impact || "Low"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
