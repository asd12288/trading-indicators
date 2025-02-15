"use client";

import LoaderCards from "../loaders/LoaderCards";
import FufilledSignalCard from "./FufilledSignalCard";
import RunningSignalCard from "./RunningSignalCard";

const SignalCard = ({ signalPassed }) => {
  if (!signalPassed) {
    return <LoaderCards />;
  }

  const isBuy = signalPassed.trade_side === "Long" ? true : false;

  if (signalPassed.exit_price === null) {
    return <RunningSignalCard instrument={signalPassed} isBuy={isBuy} />;
  }

  return <FufilledSignalCard instrument={signalPassed} isBuy={isBuy} />;
};

export default SignalCard;
