"use client";

import React from "react";
import LoaderCards from "../loaders/LoaderCards";
import FufilledSignalCard from "./FufilledSignalCard";
import RunningSignalCard from "./RunningSignalCard";
import { Signal } from "@/lib/types";

interface SignalCardProps {
  signalPassed: Signal | null;
}

const SignalCard: React.FC<SignalCardProps> = ({ signalPassed }) => {
  if (!signalPassed) {
    return <LoaderCards />;
  }

  const isBuy = signalPassed.trade_side === "Long" ? true : false;

  return signalPassed.exit_price === null ||
    signalPassed.exit_price === undefined ? (
    <RunningSignalCard instrument={signalPassed} isBuy={isBuy} />
  ) : (
    <FufilledSignalCard instrument={signalPassed} isBuy={isBuy} />
  );
};

export default SignalCard;
