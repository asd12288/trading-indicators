/**
 * Finnhub API service wrapper optimized for free tier usage
 */

// Types for economic calendar data
export interface EconomicCalendarItem {
  actual?: number | string;
  country: string;
  estimate?: number | string;
  event: string;
  impact: number | string;
  prev?: number | string;
  time: string;
  unit?: string;
  date?: string;
}

export interface EconomicCalendarResponse {
  economicCalendar: EconomicCalendarItem[];
}

// Cache to store results and prevent excessive API calls
const cacheStore: Record<string, {data: any, timestamp: number}> = {};
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

/**
 * Get economic calendar data for a date range - optimized for free tier
 */
export async function getEconomicCalendar(from: string, to: string): Promise<EconomicCalendarResponse> {
  // Check cache first
  const cacheKey = `economic-calendar-${from}-${to}`;
  const cachedData = cacheStore[cacheKey];
  
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
    console.log('Using cached economic calendar data');
    return cachedData.data;
  }
  
  try {
    // Dynamically import finnhub to avoid issues with CommonJS/ES modules
    const finnhubModule = await import('finnhub');
    const finnhub = finnhubModule.default;
    
    // Get API key from environment variables
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    
    if (!apiKey) {
      throw new Error('Finnhub API key is not configured.');
    }
    
    // Initialize the API client
    const finnhubClient = new finnhub.DefaultApi();
    finnhubClient.apiKey = apiKey;
    
    console.log('Fetching economic calendar with free tier API key');
    
    return new Promise((resolve, reject) => {
      try {
        finnhubClient.economicCalendar(from, to, (error, data, response) => {
          if (error) {
            // Check if this is a rate limit error (429)
            if (error.status === 429) {
              console.warn('Rate limit hit - Using cached or mock data');
              // Try to use cached data even if expired, or fall back to mock
              if (cachedData) {
                resolve(cachedData.data);
                return;
              }
              resolve({ economicCalendar: getMockEconomicCalendarData() });
              return;
            }
            
            console.error('Finnhub API error:', error);
            reject(error);
          } else if (!data || !data.economicCalendar) {
            console.error('Invalid response from Finnhub API');
            reject(new Error('Invalid response from Finnhub API'));
          } else {
            console.log(`Received ${data.economicCalendar.length} economic events`);
            
            // Store in cache
            cacheStore[cacheKey] = {
              data: data,
              timestamp: Date.now()
            };
            
            resolve(data);
          }
        });
      } catch (callError) {
        console.error('Error calling Finnhub API:', callError);
        reject(callError);
      }
    });
  } catch (initError) {
    console.error('Error initializing Finnhub client:', initError);
    
    // Always return mock data when there's an initialization error
    const mockData = { economicCalendar: getMockEconomicCalendarData() };
    return mockData;
  }
}

/**
 * Determine impact level from finnhub's numeric or string values
 */
export function determineImpact(impactValue: number | string): "high" | "medium" | "low" {
  if (typeof impactValue === 'number') {
    if (impactValue >= 3) return "high";
    if (impactValue >= 2) return "medium";
    return "low";
  }
  
  const impactStr = String(impactValue).toLowerCase();
  if (impactStr.includes('high') || impactStr.includes('3')) return "high";
  if (impactStr.includes('med') || impactStr.includes('2')) return "medium";
  return "low";
}

/**
 * Mock data for when API fails or rate limits are hit
 */
function getMockEconomicCalendarData(): EconomicCalendarItem[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const todayStr = today.toISOString().split('T')[0];
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  return [
    {
      actual: "3.7",
      country: "US",
      estimate: "3.8",
      event: "Unemployment Rate",
      impact: 3,
      prev: "3.9",
      time: `${todayStr} 14:30`,
      unit: "%",
      date: todayStr
    },
    {
      actual: null,
      country: "EU",
      estimate: "1.8",
      event: "ECB Interest Rate Decision",
      impact: 3,
      prev: "1.5",
      time: `${todayStr} 13:45`,
      unit: "%",
      date: todayStr
    },
    {
      actual: null,
      country: "JP",
      estimate: "2.5",
      event: "GDP Growth Rate",
      impact: 2,
      prev: "2.1",
      time: `${tomorrowStr} 02:00`,
      unit: "%",
      date: tomorrowStr
    },
    {
      actual: null,
      country: "UK",
      estimate: "6.7",
      event: "Retail Sales YoY",
      impact: 2,
      prev: "5.9",
      time: `${tomorrowStr} 09:30`,
      unit: "%",
      date: tomorrowStr
    },
    {
      actual: null,
      country: "CN",
      estimate: "49.8",
      event: "Manufacturing PMI",
      impact: 2,
      prev: "49.2",
      time: `${tomorrowStr} 03:00`,
      unit: "points",
      date: tomorrowStr
    }
  ];
}

/**
 * Free tier helper functions
 */
export async function getFreeAlternativeData(): Promise<any> {
  // This is a collection of other free endpoints you can use
  // Finnhub offers several free endpoints including:
  // - Basic company information
  // - Simple price data
  // - News
  
  try {
    const finnhubModule = await import('finnhub');
    const finnhub = finnhubModule.default;
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    
    if (!apiKey) {
      throw new Error('Finnhub API key is not configured.');
    }
    
    const finnhubClient = new finnhub.DefaultApi();
    finnhubClient.apiKey = apiKey;
    
    // Example: Get market news (also available in free tier)
    return new Promise((resolve, reject) => {
      finnhubClient.marketNews("general", {}, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve({ news: data });
        }
      });
    });
  } catch (error) {
    console.error('Error fetching alternative data:', error);
    return { news: [] };
  }
}
