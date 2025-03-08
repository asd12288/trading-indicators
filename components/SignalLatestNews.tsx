import React, { useEffect, useState } from "react";
import { ExternalLink, Calendar, RefreshCw } from "lucide-react";
import Image from "next/image";
import { getInstrumentNews } from "@/lib/services/newsService";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface NewsItem {
  id: string;
  title: string;
  url: string;
  time_published: string;
  summary: string;
  banner_image: string | null;
  source: string;
}

interface LatestNewsProps {
  symbol: string; // e.g., "NQ", "MNQ"
}

const SignalLatestNews: React.FC<LatestNewsProps> = ({ symbol }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const t = useTranslations("SignalLatestNews");

  const fetchNews = async () => {
    try {
      setLoading(true);
      const articles = await getInstrumentNews(symbol);
      setNews(articles);
      setError(null);
    } catch (err) {
      setError(t("error"));
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  useEffect(() => {
    fetchNews();
  }, [symbol]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy • HH:mm");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-700/50 p-6 pb-4">
        <h2 className="text-xl font-bold text-white">
          {t("title", { symbol })}
        </h2>
        <button
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="hover:text-primary flex items-center gap-1 text-sm text-slate-300 transition-colors disabled:opacity-50"
          aria-label={refreshing ? t("refreshing") : t("refresh")}
          title={refreshing ? t("refreshing") : t("refresh")}
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          <span>{refreshing ? t("refreshing") : t("refresh")}</span>
        </button>
      </div>

      <div className="flex-grow overflow-auto px-6 py-4">
        {loading && !refreshing ? (
          <div className="flex h-40 flex-col items-center justify-center space-y-3">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2 border-t-2"></div>
            <p className="text-sm text-slate-400">{t("loading")}</p>
          </div>
        ) : error ? (
          <div className="py-10 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={handleRefresh}
              className="text-primary mt-4 text-sm hover:underline"
            >
              {t("tryAgain")}
            </button>
          </div>
        ) : news.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-slate-400">{t("noNews", { symbol })}</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {news.map((item, index) => (
              <motion.li
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b border-slate-700/30 pb-6 last:border-0"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="-m-3 block rounded-lg p-3 transition hover:bg-slate-800/50"
                  aria-label={`${item.title} - ${t("externalLink")}`}
                >
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-semibold leading-tight text-white">
                      {item.title}
                    </h3>

                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                      <span className="text-primary font-medium">
                        {item.source}
                      </span>
                      <span className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {formatDate(item.time_published)}
                      </span>
                    </div>

                    <p className="line-clamp-2 text-sm text-gray-400">
                      {item.summary}
                    </p>

                    <div className="text-primary flex items-center gap-1 pt-1 text-xs">
                      <ExternalLink size={12} />
                      <span>{t("readFullStory")}</span>
                    </div>
                  </div>
                </a>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SignalLatestNews;
