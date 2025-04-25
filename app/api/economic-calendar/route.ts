import { getEconomicCalendar, getTodayFormatted, getFutureDateFormatted } from "@/services/finnhub";
import { NextRequest, NextResponse } from "next/server";

// Define a cache period - 12 hours in seconds
const CACHE_PERIOD = 12 * 60 * 60;

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const fromDate = searchParams.get('from') || getTodayFormatted();
    const toDate = searchParams.get('to') || getFutureDateFormatted(7);
    
    // API key from environment variables
    const apiKey = process.env.FINNHUB_API_KEY;
    
    if (!apiKey || apiKey.length < 8) {
      // Return empty array if API key is not properly configured
      // Client will fallback to TradingView widget
      return NextResponse.json({ events: [] }, {
        headers: {
          'Cache-Control': `s-maxage=${CACHE_PERIOD}, stale-while-revalidate`,
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Try to get actual data
    try {
      const events = await getEconomicCalendar(fromDate, toDate);
      return NextResponse.json({ events }, {
        headers: {
          'Cache-Control': `s-maxage=${CACHE_PERIOD}, stale-while-revalidate`,
          'Content-Type': 'application/json'
        }
      });
    } catch (apiError) {
      console.warn('Economic calendar API error:', apiError);
      // Return empty array on API error
      // Client will fallback to TradingView widget
      return NextResponse.json({ events: [] }, {
        headers: {
          'Cache-Control': `s-maxage=${CACHE_PERIOD}, stale-while-revalidate`,
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('Error in economic calendar API route:', error);
    // Return empty array on any error
    // Client will fallback to TradingView widget
    return NextResponse.json({ events: [] }, {
      headers: {
        'Cache-Control': `s-maxage=${CACHE_PERIOD}, stale-while-revalidate`,
        'Content-Type': 'application/json'
      }
    });
  }
}