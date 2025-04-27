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
  // CME equity index futures – unchanged
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
  // …(MES/MYM/MNQ/M2K identical)…

  // Eurex – DAX & friends, 00:10–21 UTC Mon-Fri
  FDAX: { open: 0.17, close: 21, dayStart: 1, dayEnd: 5 },
  FDXS: { open: 0.17, close: 21, dayStart: 1, dayEnd: 5 },
  FESX: { open: 0.17, close: 21, dayStart: 1, dayEnd: 5 },
  FDXM: { open: 0.17, close: 21, dayStart: 1, dayEnd: 5 },
  FESXM: { open: 0.17, close: 21, dayStart: 1, dayEnd: 5 },

  // OTC-Forex – 24 h with a daily 60 min maintenance break
  EUR: {
    open: 22,
    close: 21,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 21,
    breakEnd: 22,
  },
  USD: {
    open: 22,
    close: 21,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 21,
    breakEnd: 22,
  },
  GBP: {
    open: 22,
    close: 21,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 21,
    breakEnd: 22,
  },
  JPY: {
    open: 22,
    close: 21,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 21,
    breakEnd: 22,
  },
  AUD: {
    open: 22,
    close: 21,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 21,
    breakEnd: 22,
  },
  NZD: {
    open: 22,
    close: 21,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 21,
    breakEnd: 22,
  },
  CAD: {
    open: 22,
    close: 21,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 21,
    breakEnd: 22,
  },
  CHF: {
    open: 22,
    close: 21,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 21,
    breakEnd: 22,
  },

  // CME FX Futures / Micro-FX – cloned from OTC timetable
  "6E": {
    open: 22,
    close: 21,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 21,
    breakEnd: 22,
  },
  "6B": {
    open: 22,
    close: 21,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 21,
    breakEnd: 22,
  },
  "6J": {
    open: 22,
    close: 21,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 21,
    breakEnd: 22,
  },
  "6A": {
    open: 22,
    close: 21,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 21,
    breakEnd: 22,
  },
  M6E: {
    open: 22,
    close: 21,
    dayStart: 0,
    dayEnd: 5,
    hasBreak: true,
    breakStart: 21,
    breakEnd: 22,
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
export function isMarketOpen(instrument: string): boolean {
  const mkt = getMarketHours(extractBaseSymbol(instrument));
  if (!mkt) return true; // assume open

  const now = new Date();
  const dow = now.getUTCDay();
  const hour = now.getUTCHours() + now.getUTCMinutes() / 60;

  // Not a trading day
  if (dow < mkt.dayStart || dow > mkt.dayEnd) return false;

  // 24 h style (open === close) → treat as “always open” inside week
  if (mkt.open === mkt.close) {
    if (dow === mkt.dayStart && hour < mkt.open) return false; // pre-open Sun
    if (dow === mkt.dayEnd && hour >= mkt.close) return false; // after Fri close
    return true;
  }

  // Determine if current time is within session, handling spans across midnight
  const spansMidnight = mkt.open > mkt.close;
  let inSession: boolean;
  if (spansMidnight) {
    if (dow === mkt.dayStart) {
      // On start day only after open time
      inSession = hour >= mkt.open;
    } else if (dow === mkt.dayEnd) {
      // On end day only before close time
      inSession = hour < mkt.close;
    } else {
      // Full days in between are entirely open
      inSession = true;
    }
  } else {
    inSession = hour >= mkt.open && hour < mkt.close;
  }

  if (!inSession) return false;

  // Daily maintenance break
  if (
    mkt.hasBreak &&
    mkt.breakStart !== undefined &&
    mkt.breakEnd !== undefined
  ) {
    const brSpans = mkt.breakStart > mkt.breakEnd;
    const inBreak = brSpans
      ? hour >= mkt.breakStart || hour < mkt.breakEnd
      : hour >= mkt.breakStart && hour < mkt.breakEnd;
    if (inBreak) return false;
  }
  return true;
}

/**
 * Extract the base symbol from an instrument name
 */
function extractBaseSymbol(name: string) {
  return name.split(/[0-9]/)[0].toUpperCase();
}

/**
 * Get market hours for a specific symbol
 */
function getMarketHours(sym: string): MarketHours | null {
  if (marketSchedule[sym]) return marketSchedule[sym];
  return Object.keys(marketSchedule).find((k) => sym.startsWith(k))
    ? marketSchedule[
        Object.keys(marketSchedule).find((k) => sym.startsWith(k))!
      ]
    : null;
}

// Special cases for forex pairs

/**
 * Get the next market open time for a specific instrument
 * @param instrumentName The instrument ticker symbol
 * @returns Date object for next market open time or null if always open
 */
export function getNextMarketOpen(instrument: string): Date | null {
  const mkt = getMarketHours(extractBaseSymbol(instrument));
  if (!mkt) return null;

  const now = new Date();
  let dow = now.getUTCDay();
  const hr = now.getUTCHours() + now.getUTCMinutes() / 60;

  // 24 h style
  if (mkt.open === mkt.close) {
    // If we're already inside the weekly window, only Friday-close → Sunday-open is relevant
    if (
      (dow > mkt.dayStart && dow < mkt.dayEnd) ||
      (dow === mkt.dayStart && hr >= mkt.open) ||
      (dow === mkt.dayEnd && hr < mkt.close)
    ) {
      // Still closed because of daily maintenance?
      if (mkt.hasBreak && hr >= mkt.breakStart! && hr < mkt.breakEnd!) {
        const reopen = new Date(now);
        reopen.setUTCHours(mkt.breakEnd!, 0, 0, 0);
        return reopen;
      }
      return null;
    }
    // Otherwise, compute next Sunday 22:00 UTC
    const daysAhead =
      dow > mkt.dayEnd ? 7 - dow + mkt.dayStart : mkt.dayStart - dow;
    const next = new Date(now);
    next.setUTCDate(now.getUTCDate() + daysAhead);
    next.setUTCHours(mkt.open, 0, 0, 0);
    return next;
  }

  // Non-24 h products – original logic kept
  if (isMarketOpen(instrument)) {
    // Closed only because of break?
    if (mkt.hasBreak && hr >= mkt.breakStart! && hr < mkt.breakEnd!) {
      const reopen = new Date(now);
      reopen.setUTCHours(mkt.breakEnd!, 0, 0, 0);
      return reopen;
    }
    return null;
  }

  // After daily close
  if (hr >= mkt.close) {
    const next = new Date(now);
    next.setUTCDate(now.getUTCDate() + 1);
    next.setUTCHours(mkt.open, 0, 0, 0);
    return next;
  }

  // Before daily open
  if (hr < mkt.open) {
    const next = new Date(now);
    next.setUTCHours(mkt.open, 0, 0, 0);
    return next;
  }

  // Weekend
  while (dow < mkt.dayStart || dow > mkt.dayEnd) {
    now.setUTCDate(now.getUTCDate() + 1);
    dow = now.getUTCDay();
  }
  now.setUTCHours(mkt.open, 0, 0, 0);
  return now;
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
