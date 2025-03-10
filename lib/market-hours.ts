type MarketHours = {
  open: number; // Hours in UTC (0-23)
  close: number; // Hours in UTC (0-23)
  dayStart: number; // Day of week (0 = Sunday, 6 = Saturday)
  dayEnd: number; // Day of week (0 = Sunday, 6 = Saturday)
  hasBreak?: boolean;
  breakStart?: number; // Hours in UTC
  breakEnd?: number; // Hours in UTC
};

type MarketSchedule = {
  [key: string]: MarketHours;
};

// Define market hours for different instrument types
const marketSchedule: MarketSchedule = {
  // Stock Index Futures - CME
  ES: {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },
  NQ: {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },
  RTY: {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },
  YM: {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },
  MYM: {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },
  M2K: {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },
  MES: {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },
  MNQ: {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },

  // Eurex
  FDAX: { open: 7, close: 21, dayStart: 1, dayEnd: 5 },
  FDXS: { open: 7, close: 21, dayStart: 1, dayEnd: 5 },
  FESX: { open: 7, close: 21, dayStart: 1, dayEnd: 5 },
  FDXM: { open: 7, close: 21, dayStart: 1, dayEnd: 5 },
  FESXM: { open: 7, close: 21, dayStart: 1, dayEnd: 5 },
  FSXE: { open: 7, close: 21, dayStart: 1, dayEnd: 5 },

  // Forex Market
  EUR: { open: 0, close: 24, dayStart: 0, dayEnd: 5 }, // 24/5 market
  USD: { open: 0, close: 24, dayStart: 0, dayEnd: 5 },
  GBP: { open: 0, close: 24, dayStart: 0, dayEnd: 5 },
  JPY: { open: 0, close: 24, dayStart: 0, dayEnd: 5 },
  AUD: { open: 0, close: 24, dayStart: 0, dayEnd: 5 },
  NZD: { open: 0, close: 24, dayStart: 0, dayEnd: 5 },
  CAD: { open: 0, close: 24, dayStart: 0, dayEnd: 5 },
  CHF: { open: 0, close: 24, dayStart: 0, dayEnd: 5 },

  // Forex Futures
  "6E": {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },
  "6B": {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },
  "6J": {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },
  "6A": {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },
  M6E: {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },

  // Commodities
  CL: {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },
  GC: {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },
  SI: {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },
  NG: {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },
  HG: {
    open: 23,
    close: 22,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 22,
    breakEnd: 23,
  },

  // Agriculture
  ZC: {
    open: 23,
    close: 19.75,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 19.75,
    breakEnd: 23,
  },
  ZW: {
    open: 23,
    close: 19.75,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 19.75,
    breakEnd: 23,
  },
  ZS: {
    open: 23,
    close: 19.75,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 19.75,
    breakEnd: 23,
  },

  // Livestock
  LE: { open: 14.5, close: 19.08, dayStart: 1, dayEnd: 5 },
  HE: { open: 14.5, close: 19.08, dayStart: 1, dayEnd: 5 },
  GF: { open: 14.5, close: 19.08, dayStart: 1, dayEnd: 5 },
};

/**
 * Check if the market for a specific instrument is currently open
 * @param instrumentName The instrument ticker symbol
 * @returns boolean indicating if market is open
 */
export function isMarketOpen(instrumentName: string): boolean {
  // Extract base symbol (remove any suffixes like month/year codes)
  const baseSymbol = extractBaseSymbol(instrumentName);

  // Get market hours for the symbol
  const marketHours = getMarketHours(baseSymbol);
  if (!marketHours) return true; // Default to open if we don't have specific information

  const now = new Date();
  const utcHour = now.getUTCHours() + now.getUTCMinutes() / 60;
  const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 6 = Saturday

  // Check if current day is within trading days
  if (dayOfWeek < marketHours.dayStart || dayOfWeek > marketHours.dayEnd) {
    return false;
  }

  // Special handling for 24-hour markets
  if (marketHours.open === 0 && marketHours.close === 24) {
    return true;
  }

  // Handle markets that span across midnight
  if (marketHours.open > marketHours.close) {
    // Market spans across midnight
    if (utcHour >= marketHours.open || utcHour < marketHours.close) {
      // Check if we're in a break period
      if (
        marketHours.hasBreak &&
        marketHours.breakStart !== undefined &&
        marketHours.breakEnd !== undefined
      ) {
        if (
          utcHour >= marketHours.breakStart &&
          utcHour < marketHours.breakEnd
        ) {
          return false; // In break period
        }
      }
      return true;
    }
  } else {
    // Normal market hours within same day
    if (utcHour >= marketHours.open && utcHour < marketHours.close) {
      return true;
    }
  }

  return false;
}

/**
 * Extract the base symbol from an instrument name
 */
function extractBaseSymbol(instrumentName: string): string {
  // Handle common futures naming patterns
  const baseSymbol = instrumentName.split(/[0-9]/)[0]; // Remove any numbers and following characters
  return baseSymbol.toUpperCase();
}

/**
 * Get market hours for a specific symbol
 */
function getMarketHours(symbol: string): MarketHours | null {
  // First check direct match
  if (marketSchedule[symbol]) {
    return marketSchedule[symbol];
  }

  // Then check prefix match (e.g., "ES" for "ESZ3")
  for (const key in marketSchedule) {
    if (symbol.startsWith(key)) {
      return marketSchedule[key];
    }
  }

  // Special cases for forex pairs
  if (
    symbol.includes("USD") ||
    symbol.includes("EUR") ||
    symbol.includes("JPY") ||
    symbol.includes("GBP")
  ) {
    return marketSchedule["EUR"]; // Use forex 24/5 schedule
  }

  return null;
}

/**
 * Get the next market open time for a specific instrument
 * @param instrumentName The instrument ticker symbol
 * @returns Date object for next market open time or null if always open
 */
export function getNextMarketOpen(instrumentName: string): Date | null {
  const baseSymbol = extractBaseSymbol(instrumentName);
  const marketHours = getMarketHours(baseSymbol);

  if (!marketHours) return null; // No specific info
  if (
    marketHours.open === 0 &&
    marketHours.close === 24 &&
    marketHours.dayStart === 0 &&
    marketHours.dayEnd === 6
  ) {
    return null; // Always open
  }

  const now = new Date();
  const currentDay = now.getUTCDay();
  const currentHour = now.getUTCHours() + now.getUTCMinutes() / 60;

  // If we're in a break period
  if (isInBreakPeriod(marketHours, currentDay, currentHour)) {
    const nextOpen = new Date(now);
    nextOpen.setUTCHours(marketHours.breakEnd || 0, 0, 0, 0);
    return nextOpen;
  }

  // If current day is not a trading day or after market close
  if (
    currentDay < marketHours.dayStart ||
    currentDay > marketHours.dayEnd ||
    (currentDay === marketHours.dayEnd && currentHour >= marketHours.close)
  ) {
    // Find the next trading day
    let daysToAdd = 1;
    let nextDay = (currentDay + daysToAdd) % 7;

    while (nextDay < marketHours.dayStart || nextDay > marketHours.dayEnd) {
      daysToAdd++;
      nextDay = (currentDay + daysToAdd) % 7;
    }

    const nextOpen = new Date(now);
    nextOpen.setUTCDate(now.getUTCDate() + daysToAdd);
    nextOpen.setUTCHours(marketHours.open, 0, 0, 0);
    return nextOpen;
  }

  // If market is closed but opens later today
  if (currentHour < marketHours.open) {
    const nextOpen = new Date(now);
    nextOpen.setUTCHours(marketHours.open, 0, 0, 0);
    return nextOpen;
  }

  return null; // Market is currently open
}

/**
 * Check if current time is in a market break period
 */
function isInBreakPeriod(
  marketHours: MarketHours,
  currentDay: number,
  currentHour: number,
): boolean {
  if (
    !marketHours.hasBreak ||
    marketHours.breakStart === undefined ||
    marketHours.breakEnd === undefined
  ) {
    return false;
  }

  // Check if current day is a trading day
  if (currentDay >= marketHours.dayStart && currentDay <= marketHours.dayEnd) {
    // Check if current hour is in break period
    if (marketHours.breakStart > marketHours.breakEnd) {
      // Break spans across midnight
      return (
        currentHour >= marketHours.breakStart ||
        currentHour < marketHours.breakEnd
      );
    } else {
      // Break within same day
      return (
        currentHour >= marketHours.breakStart &&
        currentHour < marketHours.breakEnd
      );
    }
  }

  return false;
}

/**
 * Get formatted market hours for display
 * @param instrumentName The instrument ticker symbol
 */
export function getMarketHoursDisplay(instrumentName: string): string {
  const baseSymbol = extractBaseSymbol(instrumentName);
  const marketHours = getMarketHours(baseSymbol);

  if (!marketHours) return "24/7";

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayRange = `${days[marketHours.dayStart]}-${days[marketHours.dayEnd]}`;

  // Format time considering 24-hour markets
  if (marketHours.open === 0 && marketHours.close === 24) {
    return `${dayRange} 24h`;
  }

  // Format regular hours
  const openHour = formatUTCHour(marketHours.open);
  const closeHour = formatUTCHour(marketHours.close);

  let hoursText = `${dayRange} ${openHour}-${closeHour} UTC`;

  // Add break time if applicable
  if (
    marketHours.hasBreak &&
    marketHours.breakStart !== undefined &&
    marketHours.breakEnd !== undefined
  ) {
    const breakStart = formatUTCHour(marketHours.breakStart);
    const breakEnd = formatUTCHour(marketHours.breakEnd);
    hoursText += ` (break: ${breakStart}-${breakEnd})`;
  }

  return hoursText;
}

/**
 * Format UTC hour to display format
 */
function formatUTCHour(hour: number): string {
  // Handle hours that include minutes (e.g. 19.75 = 19:45)
  const hours = Math.floor(hour);
  const minutes = Math.round((hour - hours) * 60);

  return minutes > 0
    ? `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    : `${hours.toString().padStart(2, "0")}:00`;
}
