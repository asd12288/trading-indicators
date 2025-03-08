"use client";

import CumulativePotentialTicksChart from "@/components/charts/CumulativePotentialTicksChart";
import SignalTool from "@/components/SignalCard/SignalTool";
import SignalTable from "@/components/SignalTable";
import useInstrumentData from "@/hooks/useInstrumentData";
import useProfile from "@/hooks/useProfile";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft,
  BarChart2,
  Info,
  Activity,
  Newspaper,
  Eye,
  ChevronRight,
  Layers,
  Lock,
} from "lucide-react";
import SignalInfo from "./SignalInfo";
import SignalOverview from "./SignalOverview";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { useState } from "react";
import SignalLayoutLoader from "./loaders/SignalLayoutLoader";
import AlertNotification from "./AlertNotification";
import SignalLatestNews from "./SignalLatestNews";
import InstrumentStatusCard from "./InstrumentStatusCard";
import BlurOverlay from "./BlurOverlay";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// Tab type definition
interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  isPremium?: boolean;
}

const SignalLayout = ({ id, userId, isPro }) => {
  const { isLoading, profile } = useProfile(userId);
  const { instrumentData, isLoading: loadingInstrumentData } =
    useInstrumentData(id);
  const t = useTranslations("SignalLayout");
  const router = useRouter();

  // Tab state management
  const [activeTab, setActiveTab] = useState("overview");

  const instrumentName = instrumentData[0]?.instrument_name;

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
        <div className="hover:text-primary mb-6 flex cursor-pointer items-center gap-3 transition-colors duration-200">
          <ArrowLeft size={20} />
          <p className="text-lg font-medium">{t("allSignals")}</p>
        </div>
      </Link>

      {/* Header section with signal title and tools */}
      <div className="flex w-full flex-col items-center gap-5 rounded-xl border border-slate-700/50 bg-slate-800/90 p-6 shadow-lg backdrop-blur-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <h2 className="relative text-left text-2xl font-light md:text-3xl">
            {t("signal")}{" "}
            <span className="text-primary font-semibold">{id}</span>
          </h2>
          <div className="ml-4">
            <AlertNotification
              instrumentName={instrumentName}
              userId={userId}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <h4 className="text-sm font-medium text-slate-300 md:text-base">
            {isPro ? t("signalSettings") : t("upgradeMessage")}
          </h4>

          <SignalTool signalId={id} userId={userId} isPro={isPro} />
        </div>
      </div>

      {/* Tab navigation */}
      <div className="scrollbar-hide mb-4 mt-6 overflow-x-auto">
        <div className="flex space-x-1 border-b border-slate-700/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-slate-400 hover:text-slate-200"
              }`}
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
      <div className="min-h-[600px]">
        {/* Overview Tab - Available to all users */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <div className="flex flex-col gap-6">
              <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                <SignalOverview
                  instrumentData={instrumentData}
                  signalPassed={lastSignal}
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
                {/* Show blur overlay for free users */}
                {!isPro && (
                  <BlurOverlay
                    title={t("premium.statusTitle")}
                    description={t("premium.statusDescription")}
                    onUpgradeClick={handleUpgradeClick}
                  />
                )}
                <div className={!isPro ? "blur-sm" : ""}>
                  <InstrumentStatusCard instrumentName={instrumentName} />
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
            <div className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              <div>
                <SignalTable allSignal={instrumentData} />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
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
            className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
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

        {/* News Tab - Premium content */}
        {activeTab === "news" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
          >
            {!isPro && (
              <BlurOverlay
                title={t("premium.newsTitle")}
                description={t("premium.newsDescription")}
                onUpgradeClick={handleUpgradeClick}
              />
            )}
            <div className={!isPro ? "blur-sm" : ""}>
              <SignalLatestNews symbol={instrumentName} />
            </div>
          </motion.div>
        )}
      </div>

      <h3 className="hover:text-primary mt-6 text-slate-400 transition-colors duration-200">
        <Link href="/smart-alerts">{t("allSignals")}...</Link>
      </h3>
    </div>
  );
};

export default SignalLayout;
