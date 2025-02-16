"use client";

import SignalPerformenceChart from "@/components/charts/SignalPerformenceChart";
import SignalWinRateChart from "@/components/charts/SignalWinRateChart";
import SignalCard from "@/components/SignalCard/SignalCard";
import SignalTool from "@/components/SignalCard/SignalTool";
import SignalTable from "@/components/SignalTable";
import useInstrumentData from "@/hooks/useInstrumentData";
import useProfile from "@/hooks/useProfile";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const SignalLayout = ({ id, userId }) => {
  const { isLoading, profile } = useProfile(userId);
  const { instrumentData, isLoading: loadingInstrumentData } =
    useInstrumentData(id);

  // Show loading state while data is being fetched
  if (isLoading || loadingInstrumentData || !profile) {
    return <div></div>;
  }

  // Ensure profile and preferences exist with default values
  const preferences = profile?.preferences || {};
  const defaultPrefs = preferences[id] || {
    notifications: false,
    volume: false,
    favorite: false,
  };


  const lastSignal = instrumentData?.[0] || null;

  // Add null check for rendering
  if (!lastSignal) {
    return <div>No signal data available</div>;
  }

  return (
    <div className="mb-8 flex flex-col p-12">
      <Link href="/signals">
        <div className="flex cursor-pointer items-center gap-4 hover:text-slate-400">
          <ArrowLeft size={24} />
          <p className="my-2 text-xl">All Signals</p>
        </div>
      </Link>

      <div className="flex w-full flex-col items-center gap-4 rounded-xl bg-slate-800 p-4 md:flex-row md:items-center md:justify-between">
        <h2 className="relative mb-2 text-left text-4xl">
          Signal: <span className="font-semibold">{id}</span>
        </h2>
        <div className="flex items-center gap-4">
          <h4 className="text-xl font-medium">Signal Settings:</h4>
          <SignalTool
            signalId={id}
            userId={userId}
            defaultPrefs={defaultPrefs}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 items-center gap-4 bg-slate-950 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex h-full w-full flex-col items-center rounded-2xl bg-slate-800 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-slate-100">
            Trade card - Live
          </h2>
          <SignalCard signalPassed={lastSignal} />
        </div>
        <div className="col-span-2">
          <div className="flex h-full w-full flex-col items-center rounded-2xl bg-slate-800 p-4 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-slate-100">
              Orders of the last 3 days
            </h2>
            <SignalTable allSignal={instrumentData} />
          </div>
        </div>
        <div className="col-span-1">
          <SignalWinRateChart allSignals={instrumentData} />
        </div>
        <div className="col-span-2">
          <SignalPerformenceChart allSignal={instrumentData} />
        </div>
      </div>
      <h3 className="mt-4 text-slate-400 hover:underline">
        <Link href="/signals">All Signals...</Link>
      </h3>
    </div>
  );
};

export default SignalLayout;
