"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import useEconomicCalendar, { EconomicEvent } from "@/hooks/useEconomicCalendar";
import {
  Calendar,
  Clock,
  Flag,
  BarChart3,
  ChevronRight,
  AlertTriangle,
  Gauge
} from "lucide-react";

interface EconomicCalendarProps {
  userId?: string;
  country?: string;
  maxEvents?: number;
  showTitle?: boolean;
  className?: string;
}

const EconomicCalendar = ({
  country,
  maxEvents = 5,
  showTitle = true,
  className = "",
}: EconomicCalendarProps) => {
  const { events, isLoading, error } = useEconomicCalendar(country, maxEvents);
  const [currentTime] = useState(new Date());
  
  // You can create translations for this component
  // For now, we'll use hardcoded strings
  // const t = useTranslations("EconomicCalendar");

  // Refresh current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      // This helps with showing how much time is left until the event
      // We don't update state to avoid re-renders
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-16 w-full items-center justify-center gap-2 rounded-lg bg-slate-800/80 px-4">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400"></div>
        <span className="text-slate-300">Loading economic events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-16 w-full items-center justify-center rounded-lg bg-slate-800/80 px-4 text-amber-400">
        <AlertTriangle className="mr-2 h-4 w-4" />
        <span>Unable to load economic calendar</span>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex h-16 w-full items-center justify-center rounded-lg bg-slate-800/80 px-4 text-sm text-slate-300">
        No upcoming economic events
      </div>
    );
  }

  const formatEventTime = (dateStr: string, timeStr: string) => {
    try {
      // Parse the date and time
      const eventDate = parseISO(`${dateStr}T${timeStr}`);
      
      // Check if the event is today
      const today = new Date();
      const isToday = 
        eventDate.getDate() === today.getDate() &&
        eventDate.getMonth() === today.getMonth() &&
        eventDate.getFullYear() === today.getFullYear();
      
      if (isToday) {
        return `Today at ${format(eventDate, 'HH:mm')}`;
      } else {
        return format(eventDate, 'EEE, MMM d • HH:mm');
      }
    } catch (e) {
      return `${dateStr} ${timeStr}`;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {showTitle && (
        <div className="mb-3 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            Economic Calendar
          </h3>
        </div>
      )}
      
      <div className="space-y-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

// Helper component for each event card
const EventCard = ({ event }: { event: EconomicEvent }) => {
  // Get impact color
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  // Format the difference between forecast and previous
  const formatChange = (forecast?: string, previous?: string) => {
    if (!forecast || !previous) return null;
    
    const forecastNum = parseFloat(forecast);
    const previousNum = parseFloat(previous);
    
    if (isNaN(forecastNum) || isNaN(previousNum)) return null;
    
    const diff = forecastNum - previousNum;
    const percentage = (diff / previousNum) * 100;
    
    if (diff > 0) {
      return (
        <span className="text-green-400">
          +{Math.abs(percentage).toFixed(1)}%
        </span>
      );
    } else if (diff < 0) {
      return (
        <span className="text-red-400">
          -{Math.abs(percentage).toFixed(1)}%
        </span>
      );
    } else {
      return (
        <span className="text-slate-400">0%</span>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.01 }}
      className="group flex w-full items-center overflow-hidden rounded-lg border border-slate-700 bg-slate-800/60 p-3 transition-all hover:bg-slate-800"
    >
      {/* Impact indicator */}
      <div className="relative mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 shadow-inner">
        <Gauge className="h-5 w-5 text-slate-400" />
        <div
          className={`absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full ${getImpactColor(event.impact)} ring-1 ring-slate-900`}
        ></div>
      </div>
      
      <div className="flex flex-1 flex-col">
        {/* Event and country */}
        <div className="mb-0.5 flex items-start justify-between">
          <span className="font-medium text-white">{event.event}</span>
          <div className="flex items-center text-xs">
            <Flag className="mr-1 h-3 w-3 text-slate-400" />
            <span className="text-slate-300">{event.country}</span>
          </div>
        </div>
        
        {/* Time and forecast */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center text-slate-400">
            <Clock className="mr-1 h-3 w-3" />
            <span>{formatEventTime(event.date, event.time)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {event.forecast && (
              <div className="flex items-center">
                <span className="mr-1 text-slate-400">Forecast:</span>
                <span className="font-medium text-white">
                  {event.forecast} {event.unit || ''}
                </span>
              </div>
            )}
            
            {formatChange(event.forecast, event.previous) && (
              <div className="flex items-center">
                <BarChart3 className="mr-1 h-3 w-3 text-slate-400" />
                {formatChange(event.forecast, event.previous)}
              </div>
            )}
          </div>
        </div>
        
        {/* Previous value */}
        {event.previous && (
          <div className="mt-1 flex items-center justify-end text-xs text-slate-400">
            <span className="mr-1">Previous:</span>
            <span>{event.previous} {event.unit || ''}</span>
          </div>
        )}
      </div>
      
      <ChevronRight className="ml-2 h-4 w-4 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
};

export default EconomicCalendar;
