"use client";

import { useState, useEffect } from "react";
import EconomicCalendarComponent from "../components/EconomicCalendar/EconomicCalendarComponent";
import {
  getMockEconomicEvents,
  getEconomicCalendar,
  getTodayFormatted,
  getFutureDateFormatted,
} from "../services/finnhub";
import { EconomicEvent } from "../services/finnhub";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EconomicCalendarPage() {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("7"); // Default to 7 days
  const [useMockData, setUseMockData] = useState(true); // Set to true for development without API key

  // Load economic calendar data
  const loadCalendarData = async (days: number) => {
    setIsLoading(true);
    try {
      // Get formatted date range
      const fromDate = getTodayFormatted();
      const toDate = getFutureDateFormatted(days);

      let calendarEvents: EconomicEvent[];

      if (useMockData) {
        // Use mock data for testing
        calendarEvents = getMockEconomicEvents();
        // Artificial delay to simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
      } else {
        // Fetch real data from Finnhub API
        calendarEvents = await getEconomicCalendar(fromDate, toDate);
      }

      setEvents(calendarEvents);
    } catch (error) {
      console.error("Failed to load calendar data:", error);
      // Fallback to mock data if API fails
      setEvents(getMockEconomicEvents());
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount and when timeframe changes
  useEffect(() => {
    loadCalendarData(parseInt(timeframe));
  }, [timeframe]);

  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
  };

  // Toggle between mock and real data
  const toggleDataSource = () => {
    setUseMockData(!useMockData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-2xl font-bold">Economic Calendar</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Track upcoming economic events and releases from Finnhub
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">View:</span>
              <Select value={timeframe} onValueChange={handleTimeframeChange}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">Today</SelectItem>
                    <SelectItem value="2">2 Days</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="14">14 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleDataSource}
              className="text-xs"
            >
              {useMockData ? "Using Mock Data" : "Using Live API"}
            </Button>

            <Button
              size="sm"
              onClick={() => loadCalendarData(parseInt(timeframe))}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="p-4 md:p-6">
            <EconomicCalendarComponent events={events} isLoading={isLoading} />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
          <h3 className="mb-2 font-medium text-slate-900 dark:text-slate-200">
            About This Calendar
          </h3>
          <p>
            This economic calendar displays upcoming financial events and
            releases that may impact markets.
            {useMockData ? (
              <span className="mt-2 block text-amber-600 dark:text-amber-400">
                Currently using mock data for demonstration purposes. Toggle to
                "Using Live API" to fetch real data from Finnhub.
              </span>
            ) : (
              <span className="mt-2 block">
                Data provided by Finnhub Financial API. Updated daily.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
