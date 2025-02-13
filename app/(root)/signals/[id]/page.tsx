import { createClient } from "@/database/supabase/server";
import { redirect } from "next/navigation";
import SignalTool from "@/components/SignalCard/SignalTool";
import SignalPerformenceChart from "@/components/charts/SignalPerformenceChart";
import SignalWinRateChart from "@/components/charts/SignalWinRateChart";
import SignalCard from "@/components/SignalCard/SignalCard";
import SignalTable from "@/components/SignalTable";
import Link from "next/link";
import React from "react";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const signalId = decodeURIComponent(id);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userId = user.id;

  const { data: profile } = await supabase
    .from("profiles")
    .select("preferences")
    .eq("id", userId)
    .single();

  const defaultPrefs = (profile?.preferences &&
    profile.preferences[signalId]) || {
    notifications: false,
    volume: false,
    favorite: false,
  };

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
          Signal: <span className="font-semibold">{signalId}</span>
        </h2>
        <div className="flex items-center gap-4">
          <h4 className="text-xl font-medium">Signal Settings:</h4>
          <SignalTool
            signalId={signalId}
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
          <SignalCard signalPassed={signalId} />
        </div>
        <div className="col-span-2">
          <div className="flex h-full w-full flex-col items-center rounded-2xl bg-slate-800 p-4 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-slate-100">
              Orders of the last 3 days
            </h2>
            <SignalTable signalPassed={signalId} />
          </div>
        </div>
        <div className="col-span-1">
          <SignalWinRateChart signalPassed={signalId} />
        </div>
        <div className="col-span-2">
          <SignalPerformenceChart signalPassed={signalId} />
        </div>
      </div>
      <h3 className="mt-4 text-slate-400 hover:underline">
        <Link href="/signals">All Signals..</Link>
      </h3>
    </div>
  );
}
