"use client";

import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import useInstrumentData from "@/hooks/useInstrumentData";
import useProfile from "@/hooks/useProfile";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Activity, ArrowLeft, Eye, Info, Newspaper } from "lucide-react";
import SignalLayoutLoader from "../loaders/SignalLayoutLoader";

// Import our custom service
import {
  getMockEconomicEvents,
  EconomicEvent,
  getTodayFormatted,
  getFutureDateFormatted,
} from "../../services/finnhub";

// Import newly refactored components
import { SignalLayoutProps, Tab } from "./types";
import ErrorState from "./ErrorState";
import SignalHeader from "./SignalHeader";
import TabNavigation from "./TabNavigation";
import OverviewTab from "./OverviewTab";
import PerformanceTab from "./PerformanceTab";
import DetailsTab from "./DetailsTab";
import NewsTab from "./NewsTab";

const SignalLayout = ({ id, userId, isPro }: SignalLayoutProps) => {
  const theme = "dark";
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
  const [selectedSignal, setSelectedSignal] = useState<any>(null);

  // Tab state management
  const [activeTab, setActiveTab] = useState("overview");

  // Economic calendar state
  const [economicEvents, setEconomicEvents] = useState<EconomicEvent[]>([]);
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);

  const instrumentName = id; // Use the id directly as the instrumentName

  // Load economic calendar data
  const loadCalendarData = async () => {
    setIsCalendarLoading(true);
    try {
      // Get formatted date range - load next 7 days of events
      const fromDate = getTodayFormatted();
      const toDate = getFutureDateFormatted(7);

      // For simplicity, we'll use mock data by default
      // In production, you'd use the actual API call: await getEconomicCalendar(fromDate, toDate)
      const calendarEvents = getMockEconomicEvents();

      // Add a small delay to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      setEconomicEvents(calendarEvents);
    } catch (error) {
      console.error("Failed to load calendar data:", error);
      // Fallback to mock data on error
      setEconomicEvents(getMockEconomicEvents());
    } finally {
      setIsCalendarLoading(false);
    }
  };

  // Load economic data when the component mounts or when activeTab is "news"
  useEffect(() => {
    if (activeTab === "news") {
      loadCalendarData();
    }
  }, [activeTab]);

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
    return <ErrorState theme={theme} id={id} errorMessage={dataError} />;
  }

  // Handle no data case - prevent infinite loading
  if (!instrumentData || instrumentData.length === 0) {
    return <ErrorState theme={theme} id={id} isDataNotFound={true} />;
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

  // Common props passed to all tab content components
  const commonTabProps = {
    theme,
    instrumentName,
    instrumentData,
    tradeId,
    isPro,
    handleUpgradeClick,
    lastSignal,
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
      <SignalHeader
        theme={theme}
        id={id}
        userId={userId}
        isPro={isPro}
        tradeId={tradeId}
      />

      {/* Tab navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        isPro={isPro}
      />

      {/* Tab content */}
      <div className="min-h-[500px]">
        {activeTab === "overview" && <OverviewTab {...commonTabProps} />}

        {activeTab === "performance" && <PerformanceTab {...commonTabProps} />}

        {activeTab === "details" && <DetailsTab {...commonTabProps} />}

        {activeTab === "news" && (
          <NewsTab
            {...commonTabProps}
            economicEvents={economicEvents}
            isCalendarLoading={isCalendarLoading}
            loadCalendarData={loadCalendarData}
          />
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
