"use client";

import React, { useEffect, useState } from "react";
import { Signal } from "@/lib/types"; // adjust this import if needed
import RunningSignalCard from "../SignalCard/RunningSignalCard";
import FufilledSignalCard from "../SignalCard/FufilledSignalCard";

type DemoSignalCardProps = {
  type: string;
};

const DemoSignalCard: React.FC<DemoSignalCardProps> = ({ type }) => {
  // Convert your "type" into milliseconds, e.g. "nq" toggles every 10s, else 2s
  const time = type === "nq" ? 10000 : 8000;

  // State to toggle between running and fulfilled
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    // Random initial delay (0–2 seconds) so multiple cards don’t line up exactly
    const randomOffset = Math.floor(Math.random() * 2000);
    let intervalId: NodeJS.Timeout;

    // After the offset, start the real interval
    const offsetTimeout = setTimeout(() => {
      intervalId = setInterval(() => {
        setIsRunning((prev) => !prev);
      }, time);
    }, randomOffset);

    // Cleanup
    return () => {
      clearTimeout(offsetTimeout);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [time]);

  // Build sample data
  let instrument: Signal;
  if (type === "nq") {
    instrument = {
      client_trade_id: "123",
      result_ticks: 20,
      trade_duration: "1h",
      instrument_name: "NQ",
      trade_side: "Buy",
      entry_price: 20000,
      exit_price: 21000,
      take_profit_price: 21000,
      stop_loss_price: 19000,
      mae: 150,
      mfe: 300,
      signal: "demo",
      // Pretend the entry time was 10 min ago
      entry_time: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      // Pretend the exit time was 4 min ago
      exit_time: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    };
  } else {
    instrument = {
      instrument_name: "ES",
      trade_side: "Short",
      entry_price: 4000,
      exit_price: 3900,
      take_profit_price: 3900,
      stop_loss_price: 4100,
      mae: 5,
      mfe: 25,
      signal: "demo",
      result_ticks: 100,
      trade_duration: "1h",

      // Pretend the entry time was 10 min ago
      entry_time: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      // Pretend the exit time was 2 min ago
      exit_time: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    };
  }

  // For demonstration, assume “Buy” side means isBuy = true
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
