"use client";

import CumulativePotentialTicksChart from "@/components/charts/CumulativePotentialTicksChart";
import SignalTool from "@/components/SignalCard/SignalTool";
import SignalTable from "@/components/SignalTable";
import useInstrumentData from "@/hooks/useInstrumentData";
import useProfile from "@/hooks/useProfile";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import SignalInfo from "./SignalInfo";
import SignalOverview from "./SignalOverview";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import SignalLayoutLoader from "./loaders/SignalLayoutLoader";
import SignalStatusBar from "./SignalStatusBar";
import AlertNotification from "./AlertNotification";
import SignalSummaryStats from "./SignalSummaryStats";
import SignalLatestNews from "./SignalLatestNews";

const SignalLayout = ({ id, userId, isPro }) => {
  const { isLoading, profile } = useProfile(userId);
  const { instrumentData, isLoading: loadingInstrumentData } =
    useInstrumentData(id);
  const t = useTranslations("SignalLayout");

  const instrumentName = instrumentData[0]?.instrument_name;

  if (isLoading || loadingInstrumentData || !profile) {
    return <SignalLayoutLoader />;
  }

  const lastSignal = instrumentData?.[0] || null;

  if (!lastSignal) {
    notFound();
  }

  return (
    <div className="mx-auto mb-8 flex max-w-7xl flex-col p-3 md:p-8 lg:p-12">
      <Link href="/smart-alerts">
        <div className="hover:text-primary mb-6 flex cursor-pointer items-center gap-3 transition-colors duration-200">
          <ArrowLeft size={20} />
          <p className="text-lg font-medium">{t("allSignals")}</p>
        </div>
      </Link>

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

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-6 md:col-span-1">
          <SignalOverview
            instrumentData={instrumentData}
            signalPassed={lastSignal}
          />

          <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <SignalLatestNews symbol={instrumentName} />
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
            <SignalInfo instrumentName={instrumentName} />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              <SignalTable allSignal={instrumentData} />
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              <CumulativePotentialTicksChart allSignal={instrumentData} />
            </div>
          </div>
        </div>
      </div>

      <h3 className="hover:text-primary mt-6 text-slate-400 transition-colors duration-200">
        <Link href="/signals">{t("allSignals")}...</Link>
      </h3>
    </div>
  );
};

export default SignalLayout;
