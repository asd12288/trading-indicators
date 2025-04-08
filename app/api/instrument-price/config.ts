// Configuration for instrument price API
export const PRICE_CACHE_CONFIG = {
  // Cache time to live in milliseconds
  TTL: 10 * 1000, // 10 seconds cache

  // Stale cache can be used up to this time when DB errors occur
  STALE_TTL: 5 * 60 * 1000, // 5 minutes

  // Database query timeout
  QUERY_TIMEOUT: 5000, // 5 seconds timeout

  // Maximum history size that can be requested
  MAX_HISTORY_SIZE: 100,

  // Default history size
  DEFAULT_HISTORY_SIZE: 20,

  // How many items to prefetch for popular instruments
  PREFETCH_COUNT: 5,
};

// Popular instruments to prefetch on server start
export const POPULAR_INSTRUMENTS = [
  "BTCUSD",
  "ETHUSD",
  "EURUSD",
  "USDJPY",
  "GBPUSD",
];

// Types for cache handling
export interface CacheEntry {
  data: {
    last: number;
    timestamp: string;
    instrument_name: string;
    priceHistory?: number[];
  };
  fetchedAt: number;
}

// Global cache object - exported to share between API routes if needed
export const priceCache: Record<string, CacheEntry> = {};
