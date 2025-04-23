"use client";

import { useAlertHours } from "@/hooks/useAlertHours";
import { isMarketOpen } from "@/lib/market-hours";
import { Signal } from "@/lib/types";
import React, { useEffect, useState, memo } from "react";
import LoaderCards from "../loaders/LoaderCards";
import FufilledSignalCard from "./FufilledSignalCard";
import MarketClosedCard from "./MarketClosedCard";
import RunningSignalCard from "./RunningSignalCard";
import SystemClosedCard from "./SystemClosedCard";

interface SignalCardProps {
  signalPassed: Signal | null;
  showFavoriteControls?: boolean;
  className?: string;
}

const SignalCard: React.FC<SignalCardProps> = ({
  signalPassed,
  showFavoriteControls = true,
  className = "",
}) => {
  // Add state to track market status
  const [isMarketCurrentlyOpen, setIsMarketCurrentlyOpen] = useState(true);

  // Get alert system status
  const { isSystemActive } = useAlertHours(
    signalPassed?.instrument_name || undefined,
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

  // Always show the menu, regardless of user login status
  const actionsMenu = showFavoriteControls ? (
    <div className="absolute right-2 top-2 z-10"></div>
  ) : null;

  if (!isMarketCurrentlyOpen) {
    return (
      <div className={`group relative ${className}`}>
        {actionsMenu}
        <MarketClosedCard instrumentName={signalPassed.instrument_name} />
      </div>
    );
  }

  if (!isSystemActive) {
    return (
      <div className={`group relative ${className}`}>
        {actionsMenu}
        <SystemClosedCard instrumentName={signalPassed.instrument_name} />
      </div>
    );
  }

  // Otherwise show the appropriate signal card
  return (
    <div className={`group relative h-full w-full ${className}`}>
      {actionsMenu}
      {signalPassed.exit_price === null ||
      signalPassed.exit_price === undefined ? (
        <RunningSignalCard instrument={signalPassed} isBuy={isBuy} />
      ) : (
        <FufilledSignalCard instrument={signalPassed} isBuy={isBuy} />
      )}
    </div>
  );
};

// Display name for DevTools
SignalCard.displayName = "SignalCard";

// Only re-render when key signal properties change
const areEqual = (
  prev: React.ComponentProps<typeof SignalCard>,
  next: React.ComponentProps<typeof SignalCard>,
) => {
  const p = prev.signalPassed;
  const n = next.signalPassed;
  if (!p || !n) return p === n;
  return (
    p.client_trade_id === n.client_trade_id &&
    p.entry_time === n.entry_time &&
    p.exit_time === n.exit_time &&
    p.entry_price === n.entry_price &&
    p.exit_price === n.exit_price &&
    p.take_profit_price === n.take_profit_price &&
    p.stop_loss_price === n.stop_loss_price &&
    prev.showFavoriteControls === next.showFavoriteControls &&
    prev.className === next.className
  );
};

export default memo(SignalCard, areEqual);
