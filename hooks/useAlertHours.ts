"use client";

import { useEffect, useState } from "react";
import supabaseClient from "@/database/supabase/client";

export type AlertHours = {
  id: string;
  instrument: string;
  instrument_group: string;
  session_number: number;
  start_time_utc: string; // Format: 'HH:MM:SS'
  end_time_utc: string; // Format: 'HH:MM:SS'
  days_active: number[]; // 0 = Sunday, 6 = Saturday
  is_active: boolean;
};

export function useAlertHours(instrumentName?: string) {
  const [alertHours, setAlertHours] = useState<AlertHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [nextActiveTime, setNextActiveTime] = useState<Date | null>(null);

  // Fetch alert hours for the specific instrument
  useEffect(() => {
    if (!instrumentName) return;
    
    const fetchAlertHours = async () => {
      setLoading(true);
      try {
        const query = supabaseClient
          .from("alert_hours")
          .select("*")
          .eq("is_active", true);
        
        // If instrumentName is provided, filter by that instrument
        const { data, error } = instrumentName 
          ? await query.eq("instrument", instrumentName.toUpperCase())
          : await query;

        if (error) throw error;
        
        setAlertHours(data || []);
        checkIfSystemActive(data || []);
      } catch (err) {
        console.error("Error fetching alert hours:", err);
        setError("Failed to load alert hours");
      } finally {
        setLoading(false);
      }
    };

    fetchAlertHours();

    // Set up periodic check (every minute)
    const intervalId = setInterval(() => {
      fetchAlertHours();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [instrumentName]);

  /**
   * Check if the system is currently active for the given instrument
   */
  const checkIfSystemActive = (hours: AlertHours[]) => {
    // If no hours defined, default to system active
    if (hours.length === 0) {
      setIsSystemActive(true);
      setNextActiveTime(null);
      return;
    }

    const now = new Date();
    const currentDay = now.getUTCDay();
    const currentTime = now.getUTCHours() * 60 + now.getUTCMinutes(); // Minutes since midnight UTC

    // Check if we're within any of the active sessions
    let active = false;
    let nextActive: Date | null = null;
    let minTimeDiff = Infinity;

    for (const session of hours) {
      // Check if today is an active day
      const isDayActive = session.days_active.includes(currentDay);
      
      // Parse start and end times to minutes since midnight
      const [startHours, startMinutes] = session.start_time_utc.split(':').map(Number);
      const [endHours, endMinutes] = session.end_time_utc.split(':').map(Number);
      
      const startMinutesTotal = startHours * 60 + startMinutes;
      const endMinutesTotal = endHours * 60 + endMinutes;

      // Check if current time is within session
      if (isDayActive && currentTime >= startMinutesTotal && currentTime <= endMinutesTotal) {
        active = true;
        break;
      }

      // Calculate time until next active session
      let nextTimeMinutes = 0;
      let daysToAdd = 0;

      if (isDayActive && currentTime < startMinutesTotal) {
        // Later today
        nextTimeMinutes = startMinutesTotal - currentTime;
      } else {
        // Find next active day
        let nextDayIndex = currentDay;
        let daysChecked = 0;
        
        while (daysChecked < 7) {
          nextDayIndex = (nextDayIndex + 1) % 7;
          daysToAdd++;
          daysChecked++;
          
          if (session.days_active.includes(nextDayIndex)) {
            break;
          }
        }
        
        nextTimeMinutes = startMinutesTotal + (daysToAdd * 24 * 60) - currentTime;
      }

      // Update next active time if this is sooner
      if (nextTimeMinutes < minTimeDiff) {
        minTimeDiff = nextTimeMinutes;
        
        const nextDate = new Date();
        nextDate.setUTCDate(now.getUTCDate() + Math.floor(daysToAdd));
        nextDate.setUTCHours(startHours, startMinutes, 0, 0);
        
        nextActive = nextDate;
      }
    }

    setIsSystemActive(active);
    setNextActiveTime(nextActive);
  };

  return {
    alertHours,
    loading,
    error,
    isSystemActive,
    nextActiveTime
  };
}
