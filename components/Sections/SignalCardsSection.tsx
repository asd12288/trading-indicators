"use client";

import React from "react";
import RunningSignalCard from "@/components/SignalCard/RunningSignalCard";
import FufilledSignalCard from "@/components/SignalCard/FufilledSignalCard";

// Sample data for demonstration purposes
const runningSignalData = {
  instrument_name: "EURUSD",
  trade_side: "BUY",
  entry_price: 1.085,
  entry_time: new Date().toISOString(),
  take_profit_price: 1.095,
  stop_loss_price: 1.075,
};

const fulfilledSignalData = {
  instrument_name: "XAUUSD",
  trade_side: "SELL",
  entry_price: 2100.5,
  exit_price: 2050.25,
  entry_time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  exit_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  mae: 15.75,
  mfe: 55.3,
};

interface SignalCardsSectionProps {
  translations: {
    running: {
      title: string;
      description: string;
      items: string[];
    };
    fulfilled: {
      title: string;
      description: string;
      items: string[];
    };
  };
}

const SignalCardsSection: React.FC<SignalCardsSectionProps> = ({
  translations,
}) => {
  return (
    <div className="mt-8 space-y-10 md:space-y-14">
      {/* Running Signal Card */}
      <div className="overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg">
        <div className="flex flex-col gap-6 p-1 md:flex-row">
          <div className="flex-1 space-y-4 rounded-lg bg-gradient-to-br from-green-500/5 to-blue-500/5 p-6">
            <div className="inline-flex items-center rounded-full bg-green-500/10 md:px-3 px-0 py-1 text-sm font-medium text-green-400">
              <div className="mr-1.5 h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
              {translations.running.title}
            </div>
            <p className="text-slate-300">{translations.running.description}</p>
            <ul className="ml-1 space-y-3">
              {translations.running.items.map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-3 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative w-full transform rounded-lg md:p-4 transition-all duration-300 hover:scale-[1.02] md:w-[380px]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-500/5 blur-xl"></div>
            <div className="relative z-10">
              <RunningSignalCard instrument={runningSignalData} isBuy={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Fulfilled Signal Card */}
      <div className="overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg">
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          <div className="relative w-full transform rounded-lg md:p-4 transition-all duration-300 hover:scale-[1.02] md:w-[380px]">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-amber-500/5 blur-xl"></div>
            <div className="relative z-10">
              <FufilledSignalCard
                instrument={fulfilledSignalData}
                isBuy={false}
                demo={true}
              />
            </div>
          </div>
          <div className="flex-1 space-y-4 rounded-lg bg-gradient-to-br from-amber-500/5 to-red-500/5 p-6">
            <div className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-400">
              <div className="mr-1.5 h-2 w-2 rounded-full bg-amber-400"></div>
              {translations.fulfilled.title}
            </div>
            <p className="text-slate-300">
              {translations.fulfilled.description}
            </p>
            <ul className="ml-1 space-y-3">
              {translations.fulfilled.items.map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-3 mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalCardsSection;
