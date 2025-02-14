"use client";

import { useState } from "react";
import LoaderCards from "../loaders/LoaderCards";
import FufilledSignalCard from "./FufilledSignalCard";
import RunningSignalCard from "./RunningSignalCard";

const SignalCard = ({ signalPassed, preferences }) => {
  const [signal, setSignal] = useState(signalPassed);
  const pref = preferences || {};

  const notifications =
    pref[signalPassed.instrument_name]?.notifications || false;
  const soundOn = pref[signalPassed.instrument_name]?.volume || false;


  if (!signal) {
    return <LoaderCards />;
  }

  const isBuy = signal.trade_side === "Long" ? true : false;

  if (signal.exit_price === null) {
    return <RunningSignalCard instrument={signal} isBuy={isBuy} />;
  }

  return <FufilledSignalCard instrument={signal} isBuy={isBuy} />;
};

export default SignalCard;
