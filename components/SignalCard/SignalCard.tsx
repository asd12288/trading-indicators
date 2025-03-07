"use client";

import React from "react";
import LoaderCards from "../loaders/LoaderCards";
import FufilledSignalCard from "./FufilledSignalCard";
import RunningSignalCard from "./RunningSignalCard";
import { Signal } from "@/lib/types";

interface SignalCardProps {
  signalPassed: Signal | null;
}

// Implementing React.memo to prevent unnecessary re-renders
const SignalCard: React.FC<SignalCardProps> = React.memo(
  ({ signalPassed }) => {
    if (!signalPassed) {
      return <LoaderCards />;
    }

    const isBuy = signalPassed.trade_side === "Long" ? true : false;

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
