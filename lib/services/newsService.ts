import axios from "axios";

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  time_published: string;
  summary: string;
  banner_image: string | null;
  source: string;
}

// In-memory cache to reduce API calls
const newsCache: Record<string, { data: NewsItem[]; timestamp: number }> = {};
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Fetches financial news for a given instrument with caching
 */
export async function getInstrumentNews(symbol: string): Promise<NewsItem[]> {
  // Check cache first
  const cacheKey = symbol.toUpperCase();
  const cachedData = newsCache[cacheKey];

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    console.log(`Using cached news for ${symbol}`);
    return cachedData.data;
  }

  try {
    // For multiple API providers, we could try them in sequence if one fails
    const providers = [
      { name: "alphavantage", fn: fetchWithAlphaVantage },
      { name: "finnhub", fn: fetchWithFinnhub },
      // Add more providers as backup options
    ];

    let news: NewsItem[] = [];
    let succeeded = false;

    for (const provider of providers) {
      try {
        news = await provider.fn(symbol);
        if (news.length > 0) {
          succeeded = true;
          console.log(`Successfully fetched news using ${provider.name}`);
          break;
        }
      } catch (err) {
        console.error(`Failed to fetch news with ${provider.name}`, err);
        // Continue to next provider
      }
    }

    if (!succeeded) {
      // If all providers fail, try the mock data as a fallback
      news = getMockNewsData(symbol);
    }

    // Cache the results
    newsCache[cacheKey] = {
      data: news,
      timestamp: Date.now(),
    };

    return news;
  } catch (error) {
    console.error("Error in news service:", error);
    return getMockNewsData(symbol); // Fallback to mock data
  }
}

// Implementation for Alpha Vantage
async function fetchWithAlphaVantage(symbol: string): Promise<NewsItem[]> {
  const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || "";
  if (!apiKey) {
    throw new Error("Alpha Vantage API key not found");
  }

  const response = await axios.get(
    `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${apiKey}`,
  );

  if (!response.data || !response.data.feed) {
    return [];
  }

  return response.data.feed
    .map((item: any, index: number) => ({
      id: `av-${index}-${Date.now()}`,
      title: item.title,
      url: item.url,
      time_published: item.time_published,
      summary: item.summary,
      banner_image: item.banner_image || null,
      source: item.source,
    }))
    .slice(0, 5);
}

// Implementation for Finnhub
async function fetchWithFinnhub(symbol: string): Promise<NewsItem[]> {
  const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || "";
  if (!apiKey) {
    throw new Error("Finnhub API key not found");
  }

  const toDate = new Date().toISOString().split("T")[0];
  const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const response = await axios.get(
    `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${apiKey}`,
  );

  if (!response.data || !Array.isArray(response.data)) {
    return [];
  }

  return response.data
    .map((item: any) => ({
      id: `fh-${item.id || Date.now()}`,
      title: item.headline,
      url: item.url,
      time_published: new Date(item.datetime * 1000).toISOString(),
      summary: item.summary,
      banner_image: item.image || null,
      source: item.source,
    }))
    .slice(0, 5);
}

// Provide mock data if all APIs fail
function getMockNewsData(symbol: string): NewsItem[] {
  return [
    {
      id: `mock-1-${Date.now()}`,
      title: `Market Analysis: ${symbol} Price Movement Explained`,
      url: "#",
      time_published: new Date().toISOString(),
      summary:
        "Experts analyze recent price movements and provide outlook for upcoming market sessions.",
      banner_image: null,
      source: "Trading Analysis",
    },
    {
      id: `mock-2-${Date.now()}`,
      title: `Technical Levels to Watch for ${symbol}`,
      url: "#",
      time_published: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      summary:
        "Key support and resistance levels that traders should monitor in current market conditions.",
      banner_image: null,
      source: "Technical Insights",
    },
  ];
}
