import { NextResponse } from "next/server";
import { createClient } from "@/database/supabase/server";

// Cache structure
interface CacheEntry {
  data: {
    last: number;
    timestamp: string;
    instrument_name: string;
    priceHistory?: number[];
  };
  fetchedAt: number;
}

// In-memory cache with TTL
const cache: Record<string, CacheEntry> = {};
const CACHE_TTL = 10 * 1000; // 10 seconds cache

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const instrumentName = searchParams.get("instrument");
  const purgeCache = searchParams.get("purge") === "true";
  const historySize = parseInt(searchParams.get("history") || "20", 10);

  // Validate input
  if (!instrumentName) {
    return NextResponse.json(
      { error: "Missing instrument parameter" },
      { status: 400 },
    );
  }

  // Handle cache purge
  if (purgeCache) {
    if (cache[instrumentName]) {
      delete cache[instrumentName];
      console.log(`Cache purged for ${instrumentName}`);
    }
    return NextResponse.json({ message: "Cache purged" });
  }

  // Check cache first
  const now = Date.now();
  if (
    cache[instrumentName] &&
    now - cache[instrumentName].fetchedAt < CACHE_TTL
  ) {
    console.log(`Serving cached data for ${instrumentName}`);
    return NextResponse.json({
      ...cache[instrumentName].data,
      source: "cache",
    });
  }

  console.log(`Fetching fresh data for ${instrumentName} from Supabase`);

  try {
    const supabase = await createClient();

    // Fetch last price data from Supabase
    const { data: lastPriceData, error: lastPriceError } = await supabase
      .from("instruments_status")
      .select("last, timestamp, instrument_name")
      .eq("instrument_name", instrumentName)
      .order("timestamp", { ascending: false })
      .limit(1);

    if (lastPriceError) {
      console.error(`Supabase error for ${instrumentName}:`, lastPriceError);

      // Try to serve stale data rather than failing completely
      if (cache[instrumentName]) {
        console.log(`Serving stale cache for ${instrumentName} due to error`);
        return NextResponse.json({
          ...cache[instrumentName].data,
          source: "stale-cache",
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
      if (cache[instrumentName]) {
        console.log(
          `Serving stale cache for ${instrumentName} due to empty result`,
        );
        return NextResponse.json({
          ...cache[instrumentName].data,
          source: "stale-cache",
        });
      }

      return NextResponse.json(
        { error: "No price data available" },
        { status: 404 },
      );
    }

    // Fetch historical price data
    let priceHistory: number[] = [];

    if (cache[instrumentName] && cache[instrumentName].data.priceHistory) {
      // Use existing history and append new price
      priceHistory = [...cache[instrumentName].data.priceHistory];

      // Only add if the price is different from the last one
      if (
        priceHistory.length === 0 ||
        priceHistory[priceHistory.length - 1] !== lastPriceData[0].last
      ) {
        priceHistory.push(lastPriceData[0].last);
        // Keep only the latest N prices
        if (priceHistory.length > historySize) {
          priceHistory.shift();
        }
      }
    } else {
      // Fetch historical prices from database when cache is empty
      const { data: historyData, error: historyError } = await supabase
        .from("instruments_status")
        .select("last")
        .eq("instrument_name", instrumentName)
        .order("timestamp", { ascending: false })
        .limit(historySize);

      if (!historyError && historyData && historyData.length > 0) {
        // Reverse to get chronological order
        priceHistory = historyData.map((item) => item.last).reverse();
      } else {
        // Fallback to single price point if history fetch fails
        priceHistory = [lastPriceData[0].last];
      }
    }

    // Add price history to the response
    lastPriceData[0].priceHistory = priceHistory;

    // Update cache
    cache[instrumentName] = {
      data: lastPriceData[0],
      fetchedAt: now,
    };

    // Return the result
    return NextResponse.json({
      ...lastPriceData[0],
      source: "supabase",
    });
  } catch (error: any) {
    console.error(`Error fetching price for ${instrumentName}:`, error);

    // Try to serve stale data in case of errors
    if (cache[instrumentName]) {
      console.log(`Serving stale cache for ${instrumentName} due to error`);
      return NextResponse.json({
        ...cache[instrumentName].data,
        source: "stale-cache",
      });
    }

    return NextResponse.json(
      { error: error.message || "Failed to fetch price data" },
      { status: 500 },
    );
  }
}
