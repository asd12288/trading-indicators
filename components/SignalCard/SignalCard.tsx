"use client";

import React, { useState, useEffect } from "react";
import LoaderCards from "../loaders/LoaderCards";
import FufilledSignalCard from "./FufilledSignalCard";
import RunningSignalCard from "./RunningSignalCard";
import MarketClosedCard from "./MarketClosedCard";
import SystemClosedCard from "./SystemClosedCard";
import { Signal } from "@/lib/types";
import { isMarketOpen } from "@/lib/market-hours";
import { useAlertHours } from "@/hooks/useAlertHours";

interface SignalCardProps {
  signalPassed: Signal | null;
}

// Implementing React.memo to prevent unnecessary re-renders
const SignalCard: React.FC<SignalCardProps> = React.memo(
  ({ signalPassed }) => {
    // Add state to track market status
    const [isMarketCurrentlyOpen, setIsMarketCurrentlyOpen] = useState(true);
    
    // Get alert system status
    const { isSystemActive } = useAlertHours(
      signalPassed?.instrument_name || undefined
    );

    // Check market hours whenever instrument changes
    useEffect(() => {
      if (!signalPassed?.instrument_name) return;

      const checkMarketStatus = () => {
        setIsMarketCurrentlyOpen(isMarketOpen(signalPassed.instrument_name));
      };

      // Initial check
      checkMarketStatus();

      // Set interval to check periodically (every minute)
      const intervalId = setInterval(checkMarketStatus, 60000);

      return () => clearInterval(intervalId);
    }, [signalPassed?.instrument_name]);

    if (!signalPassed) {
      return <LoaderCards />;
    }

    const isBuy = signalPassed.trade_side === "Long" ? true : false;

    // Show appropriate card based on status
    // Priority: 1. Market closed, 2. System inactive, 3. Signal status
    if (!isMarketCurrentlyOpen) {
      return <MarketClosedCard instrumentName={signalPassed.instrument_name} />;
    }
    
    if (!isSystemActive) {
      return <SystemClosedCard instrumentName={signalPassed.instrument_name} />;
    }

    // Otherwise show the appropriate signal card
    return (
      <div className="h-full w-full">
        {signalPassed.exit_price === null ||
        signalPassed.exit_price === undefined ? (
          <RunningSignalCard instrument={signalPassed} isBuy={isBuy} />
        ) : (
          <FufilledSignalCard instrument={signalPassed} isBuy={isBuy} />
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function to only re-render if important properties changed
    if (!prevProps.signalPassed || !nextProps.signalPassed) {
      return prevProps.signalPassed === nextProps.signalPassed;
    }

    // Compare core signal properties that would affect rendering
    return (
      prevProps.signalPassed.id === nextProps.signalPassed.id &&
      prevProps.signalPassed.price === nextProps.signalPassed.price &&
      prevProps.signalPassed.change_24h === nextProps.signalPassed.change_24h &&
      prevProps.signalPassed.exit_price === nextProps.signalPassed.exit_price &&
      prevProps.signalPassed.entry_time === nextProps.signalPassed.entry_time
    );
  },
);

// Make sure to set display name for React DevTools
SignalCard.displayName = "SignalCard";

export default SignalCard;
