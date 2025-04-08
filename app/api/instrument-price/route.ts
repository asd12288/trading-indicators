import { NextResponse } from "next/server";
import { createClient } from "@/database/supabase/server";
import { PRICE_CACHE_CONFIG, priceCache, CacheEntry } from "./config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const instrumentName = searchParams.get("instrument");
  const purgeCache = searchParams.get("purge") === "true";
  const historySize = Math.min(
    parseInt(
      searchParams.get("history") ||
        PRICE_CACHE_CONFIG.DEFAULT_HISTORY_SIZE.toString(),
      10,
    ),
    PRICE_CACHE_CONFIG.MAX_HISTORY_SIZE,
  );

  // Validate input
  if (!instrumentName) {
    return NextResponse.json(
      { error: "Missing instrument parameter" },
      { status: 400 },
    );
  }

  // Handle cache purge
  if (purgeCache) {
    if (priceCache[instrumentName]) {
      delete priceCache[instrumentName];
      console.log(`Cache purged for ${instrumentName}`);
    }
    return NextResponse.json({ message: "Cache purged" });
  }

  // Check cache first
  const now = Date.now();
  if (
    priceCache[instrumentName] &&
    now - priceCache[instrumentName].fetchedAt < PRICE_CACHE_CONFIG.TTL
  ) {
    console.log(`Serving cached data for ${instrumentName}`);
    return NextResponse.json({
      ...priceCache[instrumentName].data,
      source: "cache",
      cacheAge: now - priceCache[instrumentName].fetchedAt,
    });
  }

  // Check if we can use stale cache during timeout issues
  const canUseStaleCache =
    priceCache[instrumentName] &&
    now - priceCache[instrumentName].fetchedAt < PRICE_CACHE_CONFIG.STALE_TTL;

  console.log(`Fetching fresh data for ${instrumentName} from Supabase`);

  try {
    const supabase = await createClient();

    // Use a promise with timeout to avoid hanging requests
    const fetchWithTimeout = async (
      promise: Promise<any>,
      timeoutMs: number,
    ) => {
      let timeout: NodeJS.Timeout;
      const timeoutPromise = new Promise((_, reject) => {
        timeout = setTimeout(() => {
          reject(new Error(`Query timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      });

      try {
        const result = await Promise.race([promise, timeoutPromise]);
        clearTimeout(timeout!);
        return result;
      } catch (error) {
        clearTimeout(timeout!);
        throw error;
      }
    };

    // Fetch last price data with optimized query and timeout
    const lastPricePromise = supabase
      .from("instruments_status")
      .select("last, timestamp, instrument_name")
      .eq("instrument_name", instrumentName)
      .order("timestamp", { ascending: false })
      .limit(1);

    const { data: lastPriceData, error: lastPriceError } =
      await fetchWithTimeout(
        lastPricePromise,
        PRICE_CACHE_CONFIG.QUERY_TIMEOUT,
      );

    if (lastPriceError) {
      console.error(`Supabase error for ${instrumentName}:`, lastPriceError);

      // Try to serve stale data rather than failing completely
      if (canUseStaleCache) {
        console.log(`Serving stale cache for ${instrumentName} due to error`);
        return NextResponse.json({
          ...priceCache[instrumentName].data,
          source: "stale-cache",
          cacheAge: now - priceCache[instrumentName].fetchedAt,
        });
      }

      throw new Error(lastPriceError.message);
    }

    if (
      !lastPriceData ||
      lastPriceData.length === 0 ||
      lastPriceData[0].last === null
    ) {
      console.log(`No price data found for ${instrumentName}`);

      // Try to serve stale data rather than returning nothing
      if (canUseStaleCache) {
        console.log(
          `Serving stale cache for ${instrumentName} due to empty result`,
        );
        return NextResponse.json({
          ...priceCache[instrumentName].data,
          source: "stale-cache",
          cacheAge: now - priceCache[instrumentName].fetchedAt,
        });
      }

      return NextResponse.json(
        { error: "No price data available" },
        { status: 404 },
      );
    }

    // Fetch historical price data
    let priceHistory: number[] = [];

    // Use existing history if available and append new price
    if (
      priceCache[instrumentName] &&
      priceCache[instrumentName].data.priceHistory
    ) {
      priceHistory = [...priceCache[instrumentName].data.priceHistory];

      // Only add if the price is different from the last one
      if (
        priceHistory.length === 0 ||
        priceHistory[priceHistory.length - 1] !== lastPriceData[0].last
      ) {
        priceHistory.push(lastPriceData[0].last);
        // Keep only the latest N prices
        if (priceHistory.length > historySize) {
          priceHistory = priceHistory.slice(-historySize);
        }
      }
    } else {
      // Fetch historical prices from database when cache is empty
      try {
        const historyPromise = supabase
          .from("instruments_status")
          .select("last, timestamp")
          .eq("instrument_name", instrumentName)
          .order("timestamp", { ascending: false })
          .limit(historySize);

        const { data: historyData, error: historyError } =
          await fetchWithTimeout(
            historyPromise,
            PRICE_CACHE_CONFIG.QUERY_TIMEOUT,
          );

        if (!historyError && historyData && historyData.length > 0) {
          // Filter out null values and reverse to get chronological order
          priceHistory = historyData
            .filter((item) => item.last !== null)
            .map((item) => item.last)
            .reverse();
        } else {
          // Fallback to single price point if history fetch fails
          priceHistory = [lastPriceData[0].last];
          console.warn(
            `Failed to fetch history for ${instrumentName}, using single price point`,
          );
        }
      } catch (historyError) {
        // On history fetch error, use single price point
        console.error(
          `Error fetching history for ${instrumentName}:`,
          historyError,
        );
        priceHistory = [lastPriceData[0].last];
      }
    }

    // Add price history to the response
    const result = {
      ...lastPriceData[0],
      priceHistory,
    };

    // Update cache
    priceCache[instrumentName] = {
      data: result,
      fetchedAt: now,
    };

    // Return the result
    return NextResponse.json({
      ...result,
      source: "supabase",
    });
  } catch (error: any) {
    console.error(`Error fetching price for ${instrumentName}:`, error);

    // Try to serve stale data in case of errors
    if (canUseStaleCache) {
      console.log(`Serving stale cache for ${instrumentName} due to error`);
      return NextResponse.json({
        ...priceCache[instrumentName].data,
        source: "stale-cache",
        cacheAge: now - priceCache[instrumentName].fetchedAt,
        error: error.message,
      });
    }

    return NextResponse.json(
      { error: error.message || "Failed to fetch price data" },
      { status: 500 },
    );
  }
}
