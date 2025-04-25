/**
 * Finnhub API service for economic calendar data
 */

// Define the shape of an economic event from Finnhub API
export interface EconomicEvent {
  id?: string;
  date: string;
  time?: string;
  country: string;
  indicator: string; // Or event
  period?: string;
  actual?: number | string;
  forecast?: number | string;
  previous?: number | string;
  impact: string;
}

// Define the API response format
interface FinnhubEconomicCalendarResponse {
  economicCalendar: EconomicEvent[];
}

/**
 * Fetches economic calendar events for a given date range
 * 
 * @param fromDate - Start date in YYYY-MM-DD format
 * @param toDate - End date in YYYY-MM-DD format
 * @returns Promise with economic events array
 */
export async function getEconomicCalendar(
  fromDate: string,
  toDate: string
): Promise<EconomicEvent[]> {
  // In a real app, this should be in an environment variable
  const API_KEY = process.env.FINNHUB_API_KEY || 'YOUR_FINNHUB_API_KEY_HERE';
  
  try {
    const url = `https://finnhub.io/api/v1/calendar/economic?from=${fromDate}&to=${toDate}&token=${API_KEY}`;
    const response = await fetch(url, { next: { revalidate: 86400 } }); // Cache for 24 hours
    
    if (!response.ok) {
      throw new Error(`Failed to fetch economic calendar: ${response.status}`);
    }
    
    const data: FinnhubEconomicCalendarResponse = await response.json();
    return data.economicCalendar || [];
  } catch (error) {
    console.error('Error fetching economic calendar:', error);
    return [];
  }
}

/**
 * Gets today's date in YYYY-MM-DD format
 */
export function getTodayFormatted(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Gets a future date in YYYY-MM-DD format
 * 
 * @param daysAhead - Number of days to add to current date
 */
export function getFutureDateFormatted(daysAhead: number): string {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);
  return futureDate.toISOString().split('T')[0];
}

/**
 * Generates mock economic events for testing
 * Use this when you don't have a valid API key
 */
export function getMockEconomicEvents(): EconomicEvent[] {
  // The current date is April 25, 2025 (from context)
  const today = "2025-04-25";
  const tomorrow = "2025-04-26";
  const nextWeek = "2025-05-02";
  
  return [
    {
      date: today,
      country: "US",
      indicator: "Durable Goods Orders MoM",
      actual: 0.7,
      forecast: 0.5,
      previous: -1.2,
      impact: "Medium"
    },
    {
      date: today,
      country: "US",
      indicator: "Core PCE Price Index YoY",
      actual: 2.8,
      forecast: 2.7,
      previous: 2.8,
      impact: "High"
    },
    {
      date: tomorrow,
      country: "EU",
      indicator: "Consumer Confidence",
      forecast: -14.5,
      previous: -15.1,
      impact: "Medium"
    },
    {
      date: tomorrow,
      country: "UK",
      indicator: "Manufacturing PMI",
      forecast: 50.2,
      previous: 49.8,
      impact: "Medium"
    },
    {
      date: nextWeek,
      country: "US",
      indicator: "Nonfarm Payrolls",
      forecast: 250000,
      previous: 230000,
      impact: "High"
    },
    {
      date: nextWeek,
      country: "US",
      indicator: "Unemployment Rate",
      forecast: 3.6,
      previous: 3.5,
      impact: "High"
    },
    {
      date: nextWeek,
      time: "08:30:00",
      country: "US",
      indicator: "Average Hourly Earnings MoM",
      forecast: 0.3,
      previous: 0.4,
      impact: "Medium"
    },
    {
      date: "2025-05-03",
      country: "CN",
      indicator: "Caixin Manufacturing PMI",
      forecast: 51.3,
      previous: 50.9,
      impact: "Medium"
    }
  ];
}