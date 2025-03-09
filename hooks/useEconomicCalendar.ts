"use client";

import { useState, useEffect } from "react";
import {
  getEconomicCalendar,
  determineImpact,
} from "@/lib/services/finnhubService";

export interface EconomicEvent {
  id: string;
  country: string;
  date: string; // ISO format date string
  time: string; // Time in HH:MM format
  event: string;
  impact: "high" | "medium" | "low";
  actual?: string;
  forecast?: string;
  previous?: string;
  unit?: string;
}

export default function useEconomicCalendar(country?: string, limit = 10) {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Unique identifier for this component instance to avoid duplicate requests
    const requestId = Math.random().toString(36).substring(7);
    let isMounted = true;

    const fetchCalendarData = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      try {
        // Calculate date range with a more limited scope for free tier (today + 3 days)
        // This reduces data size and chances of hitting limits
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 3); // Reduced from 7 days to 3 days

        const from = today.toISOString().split("T")[0];
        const to = endDate.toISOString().split("T")[0];

        console.log(
          `[${requestId}] Fetching economic calendar for ${from} to ${to}`,
        );

        // Use our service to fetch data
        const data = await getEconomicCalendar(from, to);

        if (!isMounted) return;

        // Transform to our expected format
        let transformedEvents = data.economicCalendar
          .filter((item) => item.event && item.country) // Filter out invalid entries
          .map((item) => ({
            id: `${item.event}-${item.time}-${Math.random().toString(36).substring(7)}`,
            country: item.country,
            date: item.date || today.toISOString().split("T")[0],
            time: item.time?.split(" ")[1] || "00:00",
            event: item.event,
            impact: determineImpact(item.impact),
            actual: item.actual?.toString(),
            forecast: item.estimate?.toString(),
            previous: item.prev?.toString(),
            unit: item.unit,
          }));

        // Filter by country if specified
        if (country) {
          transformedEvents = transformedEvents.filter(
            (event) => event.country.toLowerCase() === country.toLowerCase(),
          );
        }

        // Sort by date/time and limit
        transformedEvents = transformedEvents
          .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time || "00:00"}`);
            const dateB = new Date(`${b.date}T${b.time || "00:00"}`);
            return dateA.getTime() - dateB.getTime();
          })
          .slice(0, limit);

        setEvents(transformedEvents);
      } catch (err) {
        console.error("Error fetching economic calendar:", err);
        if (isMounted) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to fetch economic calendar"),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCalendarData();

    // Refresh data less frequently for free tier - every 3 hours instead of 30 minutes
    const intervalId = setInterval(fetchCalendarData, 3 * 60 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [country, limit]);

  return { events, isLoading, error };
}
