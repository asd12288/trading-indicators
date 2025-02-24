"use client";

import React from "react";
import SignalCard from "./SignalCard/SignalCard";
import { useSignalStatus } from "@/hooks/useSignalStatus";

const SignalOverview = ({ signalPassed, instrumentData }) => {
  const instrumentName = instrumentData[0].instrument_name;

  const { InstrumentStatus, loading, error } = useSignalStatus(instrumentName);

  if (!signalPassed) {
    return <div>No signal data available</div>;
  }

  return (
    <div className="flex flex-col space-y-4">
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <div className="mb-4">
          <h2 className="flex justify-between text-xl font-semibold text-slate-100">
            Instrument Status:{" "}
            <span>{InstrumentStatus?.isActive ? "Active" : "Deactivate"}</span>
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Last updated: {InstrumentStatus?.displayTime}
          </p>
        </div>
      )}
      <SignalCard signalPassed={signalPassed} />
    </div>
  );
};

export default SignalOverview;
