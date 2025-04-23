"use client";

import CumulativePotentialTicksChart from "@/components/charts/CumulativePotentialTicksChart";
import SignalTool from "@/components/SignalCard/SignalTool";
import SignalTable from "@/components/SignalTable";
import { useTheme } from "@/context/theme-context";
import useInstrumentData from "@/hooks/useInstrumentData";
import useProfile from "@/hooks/useProfile";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  Eye,
  Info,
  Lock,
  Newspaper,
  AlertCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BlurOverlay from "./BlurOverlay";
import InstrumentStatusCard from "./InstrumentStatusCard";
import SignalLayoutLoader from "./loaders/SignalLayoutLoader";
import SignalCard from "./SignalCard/SignalCard";
import SignalHoursInfo from "./SignalHoursInfo";
import SignalInfo from "./SignalInfo";
import TradingViewNewsWidget from "./TradingViewNewsWidget";

// Tab type definition
interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  isPremium?: boolean;
}

const SignalLayout = ({ id, userId, isPro }) => {
  const { theme } = useTheme();
  const { isLoading: profileLoading, profile } = useProfile(userId);
  const {
    instrumentData,
    isLoading: dataLoading,
    error: dataError,
  } = useInstrumentData(id);
  const t = useTranslations("SignalLayout");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the trade_id from URL if present
  const tradeId = searchParams.get("trade_id");

  // State to hold the selected signal
  const [selectedSignal, setSelectedSignal] = useState(null);

  // Tab state management
  const [activeTab, setActiveTab] = useState("overview");

  const instrumentName = id; // Use the id directly as the instrumentName

  // Effect to find the specific trade by ID when data is loaded
  useEffect(() => {
    if (!dataLoading && instrumentData && instrumentData.length > 0) {
      if (tradeId) {
        // Find the specific trade if trade_id is in the URL
        const foundSignal = instrumentData.find(
          (signal) =>
            String(signal.id) === tradeId ||
            String(signal.client_trade_id) === tradeId,
        );

        if (foundSignal) {
          setSelectedSignal(foundSignal);
        } else {
          // If not found, default to the latest signal
          setSelectedSignal(instrumentData[0]);
        }
      } else {
        // Default to latest signal if no trade_id specified
        setSelectedSignal(instrumentData[0]);
      }
    }
  }, [dataLoading, instrumentData, tradeId]);

  // Loading state handling
  const isLoading = profileLoading || dataLoading;

  // Show loading indicator only during initial load
  if (isLoading) {
    return <SignalLayoutLoader />;
  }

  // Handle error states - prevent infinite loading
  if (dataError) {
    return (
      <div className="mx-auto mb-8 flex max-w-7xl flex-col p-3 md:p-8 lg:p-12">
        <Link href="/smart-alerts">
          <div
            className={cn(
              "mb-6 flex cursor-pointer items-center gap-3 transition-colors duration-200",
              theme === "dark"
                ? "hover:text-primary"
                : "text-slate-700 hover:text-blue-600",
            )}
          >
            <ArrowLeft size={20} />
            <p className="text-lg font-medium">{t("allSignals")}</p>
          </div>
        </Link>

        <div
          className={cn(
            "flex w-full flex-col items-center gap-5 rounded-xl border p-6 shadow-lg backdrop-blur-sm",
            theme === "dark"
              ? "border-red-700/50 bg-red-800/20"
              : "border-red-200 bg-red-50",
          )}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h2 className="text-xl font-medium text-red-500">
              Error Loading Signal Data
            </h2>
          </div>
          <p className="text-center">
            {dataError ||
              "Failed to load signal data. This instrument may not exist."}
          </p>
          <Link href="/smart-alerts">
            <button
              className={cn(
                "mt-4 rounded-md border px-4 py-2",
                theme === "dark"
                  ? "border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
              )}
            >
              Return to All Signals
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Handle no data case - prevent infinite loading
  if (!instrumentData || instrumentData.length === 0) {
    return (
      <div className="mx-auto mb-8 flex max-w-7xl flex-col p-3 md:p-8 lg:p-12">
        <Link href="/smart-alerts">
          <div
            className={cn(
              "mb-6 flex cursor-pointer items-center gap-3 transition-colors duration-200",
              theme === "dark"
                ? "hover:text-primary"
                : "text-slate-700 hover:text-blue-600",
            )}
          >
            <ArrowLeft size={20} />
            <p className="text-lg font-medium">{t("allSignals")}</p>
          </div>
        </Link>

        <div
          className={cn(
            "flex w-full flex-col items-center gap-5 rounded-xl border p-6 shadow-lg backdrop-blur-sm",
            theme === "dark"
              ? "border-blue-700/50 bg-blue-800/20"
              : "border-blue-200 bg-blue-50",
          )}
        >
          <h2
            className={cn(
              "text-xl font-medium",
              theme === "dark" ? "text-white" : "text-slate-800",
            )}
          >
            No Signal Data Available for {id}
          </h2>
          <p className="text-center">
            We couldn't find any trading signals for this instrument. Please
            check back later or try another instrument.
          </p>
          <Link href="/smart-alerts">
            <button
              className={cn(
                "mt-4 rounded-md border px-4 py-2",
                theme === "dark"
                  ? "border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
              )}
            >
              Browse All Signals
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Use the selected signal or fall back to the latest one
  const lastSignal = selectedSignal || instrumentData?.[0] || null;

  // Define our tabs and mark premium ones
  const tabs: Tab[] = [
    { id: "overview", label: t("tabs.overview"), icon: <Eye size={16} /> },
    {
      id: "performance",
      label: t("tabs.performance"),
      icon: <Activity size={16} />,
    },
    {
      id: "details",
      label: t("tabs.details"),
      icon: <Info size={16} />,
      isPremium: true,
    },
    {
      id: "news",
      label: t("tabs.news"),
      icon: <Newspaper size={16} />,
      isPremium: true,
    },
  ];

  const handleUpgradeClick = () => {
    router.push("/upgrade");
  };

  return (
    <div className="mx-auto mb-8 flex max-w-7xl flex-col p-3 md:p-8 lg:p-12">
      <Link href="/smart-alerts">
        <div
          className={cn(
            "mb-6 flex cursor-pointer items-center gap-3 transition-colors duration-200",
            theme === "dark"
              ? "hover:text-primary"
              : "text-slate-700 hover:text-blue-600",
          )}
        >
          <ArrowLeft size={20} />
          <p className="text-lg font-medium">{t("allSignals")}</p>
        </div>
      </Link>

      {/* Header section with signal title and tools */}
      <div
        className={cn(
          "flex w-full flex-col items-center gap-5 rounded-xl border p-6 shadow-lg backdrop-blur-sm md:flex-row md:items-center md:justify-between",
          theme === "dark"
            ? "border-slate-700/50 bg-slate-800/90"
            : "border-slate-200 bg-white",
        )}
      >
        <div className="flex items-center">
          <h2
            className={cn(
              "relative text-left text-2xl font-light md:text-3xl",
              theme === "dark" ? "text-white" : "text-slate-800",
            )}
          >
            {t("signal")}{" "}
            <span className="text-primary font-semibold">{id}</span>
            {tradeId && (
              <span className="ml-2 text-sm text-slate-400">
                (Trade ID: {tradeId.substring(0, 6)}...)
              </span>
            )}
          </h2>
          <div className="ml-4"></div>
        </div>

        <div className="flex items-center gap-4">
          <h4
            className={cn(
              "text-sm font-medium md:text-base",
              theme === "dark" ? "text-slate-300" : "text-slate-600",
            )}
          >
            {isPro ? t("signalSettings") : t("upgradeMessage")}
          </h4>

          <SignalTool signalId={id} userId={userId} isPro={isPro} />
        </div>
      </div>

      {/* Tab navigation */}
      <div className="scrollbar-hide mb-4 mt-6 overflow-x-auto">
        <div
          className={cn(
            "flex space-x-1 border-b",
            theme === "dark" ? "border-slate-700/50" : "border-slate-200",
          )}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors duration-200",
                activeTab === tab.id
                  ? "text-primary"
                  : theme === "dark"
                    ? "text-slate-400 hover:text-slate-200"
                    : "text-slate-600 hover:text-slate-800",
              )}
            >
              <span className="flex items-center gap-2">
                {tab.icon} {tab.label}
                {tab.isPremium && !isPro && (
                  <Lock size={12} className="text-amber-400" />
                )}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="bg-primary absolute bottom-0 left-0 h-0.5 w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="min-h-[500px]">
        {/* Overview Tab - Available to all users - SWAPPED COMPONENTS */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Main container with responsive grid setup - adjusted gap and height */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left column - Signal Status */}
              <div
                className={cn(
                  "rounded-xl border shadow-lg transition-all",
                  theme === "dark"
                    ? "border-slate-700/50 bg-slate-800/90 backdrop-blur-sm"
                    : "border-slate-200 bg-white",
                )}
              >
                {/* Reduced padding */}
                <div className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "mr-2 h-3 w-3 rounded-full",
                          theme === "dark" ? "bg-blue-400" : "bg-blue-500",
                        )}
                      ></div>
                      <h3
                        className={cn(
                          "text-sm font-medium uppercase tracking-wider",
                          theme === "dark"
                            ? "text-slate-300"
                            : "text-slate-700",
                        )}
                      >
                        {t("signalStatusTitle")}
                      </h3>
                    </div>

                    {/* Show indicator when viewing a specific trade */}
                    {tradeId && (
                      <div className="rounded bg-blue-900/20 px-2 py-1 text-xs text-blue-400">
                        Viewing specific trade
                      </div>
                    )}
                  </div>

                  <SignalCard signalPassed={lastSignal} />
                </div>
              </div>

              {/* Right column - Instrument Status */}
              <div
                className={cn(
                  "relative rounded-xl border shadow-lg transition-all",
                  theme === "dark"
                    ? "border-slate-700/50 bg-slate-800/90 backdrop-blur-sm"
                    : "border-slate-200 bg-white",
                )}
              >
                {/* Show blur overlay for free users */}
                {!isPro && (
                  <BlurOverlay
                    title={t("premium.statusTitle")}
                    description={t("premium.statusDescription")}
                    onUpgradeClick={handleUpgradeClick}
                  />
                )}

                <div className={!isPro ? "blur-sm" : ""}>
                  {/* Removed padding wrapper to avoid double padding */}
                  <div className="mb-3 flex items-center px-4 pt-4">
                    <div
                      className={cn(
                        "mr-2 h-3 w-3 rounded-full",
                        theme === "dark" ? "bg-amber-400" : "bg-amber-500",
                      )}
                    ></div>
                    <h3
                      className={cn(
                        "text-sm font-medium uppercase tracking-wider",
                        theme === "dark" ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      {t("instrumentStatusTitle")}
                    </h3>
                  </div>

                  <InstrumentStatusCard instrumentName={instrumentName} />
                </div>
              </div>

              {/* Full width section - Trading Hours */}
              <div
                className={cn(
                  "relative rounded-xl border shadow-lg transition-all lg:col-span-2",
                  theme === "dark"
                    ? "border-slate-700/50 bg-slate-800/90 backdrop-blur-sm"
                    : "border-slate-200 bg-white",
                )}
              >
                <div className="p-4">
                  <div className="mb-3 flex items-center">
                    <div
                      className={cn(
                        "mr-2 h-3 w-3 rounded-full",
                        theme === "dark" ? "bg-violet-400" : "bg-violet-500",
                      )}
                    ></div>
                    <h3
                      className={cn(
                        "text-sm font-medium uppercase tracking-wider",
                        theme === "dark" ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      {t("tradingHoursTitle")}
                    </h3>
                  </div>

                  <SignalHoursInfo instrumentName={instrumentName} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Performance Tab - Premium content */}
        {activeTab === "performance" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-xl border shadow-lg transition-all duration-300 hover:shadow-xl",
                theme === "dark"
                  ? "border-slate-700/50 bg-slate-800/90 backdrop-blur-sm"
                  : "border-slate-200 bg-white",
              )}
            >
              <div>
                <SignalTable
                  allSignal={instrumentData}
                  highlightTradeId={tradeId}
                />
              </div>
            </div>

            <div
              className={cn(
                "relative overflow-hidden rounded-xl border shadow-lg transition-all duration-300 hover:shadow-xl",
                theme === "dark"
                  ? "border-slate-700/50 bg-slate-800/90 backdrop-blur-sm"
                  : "border-slate-200 bg-white",
              )}
            >
              {!isPro && <div className="absolute inset-0 bg-slate-900/30" />}
              <div>
                <CumulativePotentialTicksChart allSignal={instrumentData} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Details Tab - Premium content */}
        {activeTab === "details" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative overflow-hidden rounded-xl border shadow-lg transition-all duration-300 hover:shadow-xl",
              theme === "dark"
                ? "border-slate-700/50 bg-slate-800/90 backdrop-blur-sm"
                : "border-slate-200 bg-white",
            )}
          >
            {!isPro && (
              <BlurOverlay
                title={t("premium.detailsTitle")}
                description={t("premium.detailsDescription")}
                onUpgradeClick={handleUpgradeClick}
              />
            )}
            <div className={!isPro ? "blur-sm" : ""}>
              <SignalInfo instrumentName={instrumentName} />
            </div>
          </motion.div>
        )}

        {/* News Tab - Premium content with TradingView News Widget */}
        {activeTab === "news" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative overflow-hidden rounded-xl border shadow-lg transition-all duration-300 hover:shadow-xl",
              theme === "dark"
                ? "border-slate-700/50 bg-slate-800/90 backdrop-blur-sm"
                : "border-slate-200 bg-white",
            )}
          >
            {!isPro && (
              <BlurOverlay
                title={t("premium.newsTitle")}
                description={t("premium.newsDescription")}
                onUpgradeClick={handleUpgradeClick}
              />
            )}
            <div className={!isPro ? "blur-sm" : ""}>
              <div className="p-4">
                <div className="mb-3 flex items-center">
                  <div
                    className={cn(
                      "mr-2 h-3 w-3 rounded-full",
                      theme === "dark" ? "bg-blue-400" : "bg-blue-500",
                    )}
                  ></div>
                  <h3
                    className={cn(
                      "text-sm font-medium uppercase tracking-wider",
                      theme === "dark" ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    {/* Use a hardcoded fallback for the missing translation */}
                    {t("tabs.news")} - {instrumentName}
                  </h3>
                </div>

                {/* Fixed TradingView News Widget implementation */}
                <div className="mt-4">
                  <TradingViewNewsWidget
                    symbol={instrumentName}
                    height={500}
                    showHeader={false}
                    newsCount={15}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <h3
        className={cn(
          "mt-6 transition-colors duration-200",
          theme === "dark"
            ? "hover:text-primary text-slate-400"
            : "text-slate-600 hover:text-blue-600",
        )}
      >
        <Link href="/smart-alerts">{t("allSignals")}...</Link>
      </h3>
    </div>
  );
};

export default SignalLayout;
