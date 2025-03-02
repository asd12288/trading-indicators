import React, { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { fetchLatestNews } from "@/lib/fetchnews";

interface NewsItem {
  title: string;
  url: string;
  time_published: string;
  summary: string;
  banner_image: string | null;
}

interface LatestNewsProps {
  symbol: string; // e.g., "NQ", "MNQ"
}

const SignalLatestNews: React.FC<LatestNewsProps> = ({ symbol }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getNews() {
      const articles = await fetchLatestNews(symbol);
      setNews(articles);
      setLoading(false);
    }

    getNews();
  }, [symbol]);

  if (loading) return <div className="text-gray-400">Loading news...</div>;

  if (news.length === 0)
    return <div className="text-gray-400">No recent news available.</div>;

  return (
    <div className="rounded-lg bg-slate-800 p-4 shadow-md">
      <h2 className="mb-3 text-xl font-bold text-white">
        Latest News on {symbol}
      </h2>
      <ul className="space-y-4">
        {news.map((item, index) => (
          <li key={index} className="border-b border-slate-700 pb-3">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 transition hover:text-blue-400"
            >
              <div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.summary}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <ExternalLink size={12} />
                  <span>Read more</span>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SignalLatestNews;
