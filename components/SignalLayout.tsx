"use client";

import CumulativePotentialTicksChart from "@/components/charts/CumulativePotentialTicksChart";
import SignalTool from "@/components/SignalCard/SignalTool";
import SignalTable from "@/components/SignalsTable";
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
        <div className="flex items-center gap-4">
          <h4 className="text-sm font-medium md:text-xl">
            {isPro ? t("signalSettings") : t("upgradeMessage")}
          </h4>

          <SignalTool signalId={id} userId={userId} isPro={isPro} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="grid-span-1 grid grid-cols-1 gap-4 md:col-span-1">
          <SignalOverview
            instrumentData={instrumentData}
            signalPassed={lastSignal}
          />

          <div className="">
            <SignalLatestNews symbol={instrumentName} />
          </div>

          <div className="">
            <SignalInfo instrumentName={instrumentName} />
          </div>
        </div>

        <div className="col-span-2">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <SignalSummaryStats data={instrumentData} />
            </div>

            <div className="">
              <SignalTable allSignal={instrumentData} />
            </div>

            <div className="">
              <CumulativePotentialTicksChart allSignal={instrumentData} />
            </div>
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
