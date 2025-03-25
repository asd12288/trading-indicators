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
import { Activity, ArrowLeft, Eye, Info, Lock, Newspaper } from "lucide-react";
import { useTranslations } from "next-intl";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";
import AlertNotification from "./AlertNotification";
import BlurOverlay from "./BlurOverlay";
import InstrumentStatusCard from "./InstrumentStatusCard";
import SignalLayoutLoader from "./loaders/SignalLayoutLoader";
import SignalInfo from "./SignalInfo";
import SignalLatestNews from "./SignalLatestNews";
import SignalCard from "./SignalCard/SignalCard";
import SignalHoursInfo from "./SignalHoursInfo";
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
  const { isLoading, profile } = useProfile(userId);
  const { instrumentData, isLoading: loadingInstrumentData } =
    useInstrumentData(id);
  const t = useTranslations("SignalLayout");
  const router = useRouter();

  // Tab state management
  const [activeTab, setActiveTab] = useState("overview");
  // Remove the market status state since it's now handled in the SignalCard

  const instrumentName = instrumentData[0]?.instrument_name;

  // Remove the market status check effect

  if (isLoading || loadingInstrumentData || !profile) {
    return <SignalLayoutLoader />;
  }

  const lastSignal = instrumentData?.[0] || null;

  if (!lastSignal) {
    notFound();
  }

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
          </h2>
          <div className="ml-4"></div>
        </div>

        <div>
          <AlertNotification instrumentName={instrumentName} userId={userId} />
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
                      {t("signalStatusTitle")}
                    </h3>
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
                <SignalTable allSignal={instrumentData} />
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
