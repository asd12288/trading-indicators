"use client";

import SignalPerformenceChart from "@/components/charts/SignalPerformenceChart";
import SignalWinRateChart from "@/components/charts/SignalWinRateChart";
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
    <div className="mb-8 flex flex-col p-2 md:p-12">
      <Link href="/smart-alerts">
        <div className="flex cursor-pointer items-center gap-4 hover:text-slate-400">
          <ArrowLeft size={24} />
          <p className="my-2 text-xl">{t("allSignals")}</p>
        </div>
      </Link>

      <div className="flex w-full flex-col items-center gap-4 rounded-xl bg-slate-800 p-6 md:flex-row md:items-center md:justify-between">
        <h2 className="relative mb-2 text-left text-2xl md:text-4xl">
          {t("signal")}{" "}
          <span className="font-medium md:font-semibold">{id}</span>
        </h2>
        <AlertNotification instrumentName={instrumentName} userId={userId} />
        <SignalStatusBar instrumentName={instrumentName} />
        <div className="flex items-center gap-4">
          <h4 className="text-sm font-medium md:text-xl">
            {isPro ? t("signalSettings") : t("upgradeMessage")}
          </h4>

          <SignalTool signalId={id} userId={userId} isPro={isPro} />
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-4 bg-slate-950 md:grid md:grid-cols-3">
        <div className="flex h-full w-full flex-col items-center rounded-2xl bg-slate-800 p-6 shadow-lg">
          <SignalOverview
            instrumentData={instrumentData}
            signalPassed={lastSignal}
          />
        </div>
        <div className="col-span-2">
          <div className="hidden h-full w-full flex-col items-center rounded-2xl bg-slate-800 shadow-lg md:block">
            <SignalTable allSignal={instrumentData} />
          </div>
        </div>
        <div className="col-span-1 w-full">
          <SignalWinRateChart allSignals={instrumentData} />
        </div>
        <div className="col-span-2 w-full">
          <SignalPerformenceChart allSignal={instrumentData} />
        </div>
      </div>
      <div className="col-span-3 mt-4 w-full rounded-2xl bg-slate-800 p-6 shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <SignalInfo instrumentName={instrumentName} />
          </div>
        </div>
      </div>
      <h3 className="mt-4 text-slate-400 hover:underline">
        <Link href="/signals">{t("allSignals")}...</Link>
      </h3>
    </div>
  );
};

export default SignalLayout;
