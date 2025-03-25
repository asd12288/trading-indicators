"use client";

import React, { useEffect, useState } from "react";
import { Signal } from "@/lib/types";
import RunningSignalCard from "../SignalCard/RunningSignalCard";
import FufilledSignalCard from "../SignalCard/FufilledSignalCard";

type DemoSignalCardProps = {
  type: string;
};

const DemoSignalCard: React.FC<DemoSignalCardProps> = ({ type }) => {
  // Use a consistent toggle time for all instruments
  const toggleTime = 8000;

  // State to toggle between running and fulfilled
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    // Random initial delay (0–2 seconds) so multiple cards don't line up exactly
    const randomOffset = Math.floor(Math.random() * 2000);
    let intervalId: NodeJS.Timeout;

    // After the offset, start the real interval
    const offsetTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        setIsRunning((prev) => !prev);
      }, toggleTime);
    }, randomOffset);

    // Cleanup
    return () => {
      clearTimeout(offsetTimeout);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [toggleTime]);

  // Build sample data - create a consistent demo instrument
  const instrument: Signal = {
    client_trade_id: "demo-123",
    result_ticks: 20,
    trade_duration: "1h",
    instrument_name: "ES", // Default to ES (S&P 500 futures)
    trade_side: "Buy",
    entry_price: 5622,
    exit_price: 5642,
    take_profit_price: 5652,
    stop_loss_price: 5592,
    mae: 5,
    mfe: 30,
    signal: "demo",
    // Pretend the entry time was 10 min ago
    entry_time: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    // Pretend the exit time was 4 min ago
    exit_time: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  };

  // For demonstration, assume "Buy" side means isBuy = true
  const isBuy = instrument.trade_side.toLowerCase() === "buy";

  return (
    <div className="flex transform items-center justify-center md:min-h-screen md:scale-100">
      {isRunning ? (
        <RunningSignalCard demo={true} instrument={instrument} isBuy={isBuy} />
      ) : (
        <FufilledSignalCard demo={true} instrument={instrument} isBuy={isBuy} />
      )}
    </div>
  );
};

export default DemoSignalCard;
