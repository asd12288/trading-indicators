"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DemoCard from "@/components/demo/DemoCards";
import { useTranslations } from "next-intl";

export default function CardShowcase() {
  const [instrument, setInstrument] = useState<string>("NQ");
  const t = useTranslations("InfoPage");
  const runningT = useTranslations("RunningSignalCard");
  const fulfilledT = useTranslations("FulfilledSignalCard");
  const marketT = useTranslations("MarketClosedCard");
  const systemT = useTranslations("SystemClosedCard");

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
      <h2 className="mb-6 text-2xl font-bold text-white">
        {t("sections.signalCards.title")}
      </h2>
      
      <Tabs defaultValue="running" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-4 gap-2">
          <TabsTrigger
            value="running"
            className="data-[state=active]:bg-emerald-800/30 data-[state=active]:text-emerald-400"
          >
            {runningT("signalActive")}
          </TabsTrigger>
          <TabsTrigger
            value="fulfilled"
            className="data-[state=active]:bg-blue-800/30 data-[state=active]:text-blue-400"
          >
            {fulfilledT("tradeOver")}
          </TabsTrigger>
          <TabsTrigger
            value="marketClosed"
            className="data-[state=active]:bg-amber-800/30 data-[state=active]:text-amber-400"
          >
            {marketT("marketClosed")}
          </TabsTrigger>
          <TabsTrigger
            value="systemClosed"
            className="data-[state=active]:bg-gray-800/30 data-[state=active]:text-gray-400"
          >
            {systemT("alertsOffline")}
          </TabsTrigger>
        </TabsList>
        
        <div className="mb-4">
          <label className="mb-2 block text-sm text-slate-400">Select Instrument</label>
          <select
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-800 p-2 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="NQ">NQ (Nasdaq)</option>
            <option value="ES">ES (S&P 500)</option>
            <option value="EURUSD">EUR/USD</option>
          </select>
        </div>
        
        <TabsContent value="running">
          <div className="h-[550px]">
            <DemoCard type="running" instrumentName={instrument} tradeSide="Long" />
          </div>
        </TabsContent>
        
        <TabsContent value="fulfilled">
          <div className="h-[550px]">
            <DemoCard type="fulfilled" instrumentName={instrument} tradeSide="Long" />
          </div>
        </TabsContent>
        
        <TabsContent value="marketClosed">
          <div className="h-[550px]">
            <DemoCard type="marketClosed" instrumentName={instrument} />
          </div>
        </TabsContent>
        
        <TabsContent value="systemClosed">
          <div className="h-[550px]">
            <DemoCard type="systemClosed" instrumentName={instrument} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
