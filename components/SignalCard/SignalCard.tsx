"use client";

import { useAlertHours } from "@/hooks/useAlertHours";
import { useRouter } from "@/i18n/routing";
import { isMarketOpen } from "@/lib/market-hours";
import { Signal } from "@/lib/types";
import React, { useEffect, useState } from "react";
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

// Implementing React.memo to prevent unnecessary re-renders
const SignalCard: React.FC<SignalCardProps> = React.memo(
  ({ signalPassed, showFavoriteControls = true, className = "" }) => {
    // Add state to track market status
    const [isMarketCurrentlyOpen, setIsMarketCurrentlyOpen] = useState(true);
    const router = useRouter();

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
      prevProps.signalPassed.entry_time === nextProps.signalPassed.entry_time &&
      prevProps.signalPassed.take_profit_price === nextProps.signalPassed.take_profit_price &&
      prevProps.signalPassed.stop_loss_price === nextProps.signalPassed.stop_loss_price &&
      prevProps.showFavoriteControls === nextProps.showFavoriteControls
    );
  },
);

// Make sure to set display name for React DevTools
SignalCard.displayName = "SignalCard";

export default SignalCard;
