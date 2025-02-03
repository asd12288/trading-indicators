import React from "react";
import { FaArrowUp, FaCheck } from "react-icons/fa";
import { TbHandStop } from "react-icons/tb";
import { RxEnter } from "react-icons/rx";
import { TfiTarget } from "react-icons/tfi";
import supabase from "@/utils/supabase";
import FufilledSignalCard from "./FufilledSignalCard";
import { FormattedTime } from "./FormattedTime";

const SignalCard = async ({ instrument }) => {
  const { data: orderEnd, error } = await supabase
    .from("indicators_order_end")
    .select("*")
    .eq("orderid", instrument.orderid)
    .maybeSingle();

  const isFufiled = orderEnd && orderEnd.exitGain !== null;
  const isBuy = instrument.tradeType.toLowerCase() === "buy";

  if (error || !orderEnd) return <p>Error loading signals</p>;

  if (isFufiled)
    return (
      <FufilledSignalCard
        instrument={instrument}
        orderEnd={orderEnd}
        isBuy={isBuy}
      />
    );

  return (
    <div className="h-fit w-72 rounded-sm bg-slate-800">
      <div
        className={`flex min-h-16 items-center justify-between ${
          isBuy ? "bg-green-700" : "bg-red-700"
        } p-4`}
      >
        <div>
          <h3 className="text-2xl font-semibold">{instrument.instrument}</h3>
          <p className="text-xs">
            Started: <FormattedTime date={instrument.orderTime} />
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p
            className={`font-bold ${isBuy ? "text-green-200" : "text-red-200"}`}
          >
            {instrument.tradeType.toUpperCase()}
          </p>
          <FaArrowUp
            className={`animate-bounce text-4xl ${isBuy ? "text-green-200" : "text-red-200"}`}
          />
        </div>
      </div>

      <div className="flex justify-between border-b-2 border-slate-500 p-4">
        <p>Status:</p>

        <div className="flex items-center gap-2">
          <FaCheck />
          <p>{instrument.status ? "Active" : "No Active"}</p>
        </div>
      </div>

      <div className="flex justify-between border-b-2 border-slate-500 p-4">
        <p>Enrty Price:</p>
        <div className="flex items-center gap-2">
          <RxEnter />
          <p className="text-lg font-medium">{instrument.entryprice}</p>
        </div>
      </div>

      <div className="flex justify-between border-b-2 border-slate-500 p-4">
        <p>Stop Price:</p>
        <div className="flex items-center gap-2">
          <TbHandStop />
          <p className="text-lg font-medium">{instrument.stopPrice}</p>
        </div>
      </div>

      <div className="flex justify-between border-b-2 border-slate-500 p-4">
        <p>Target Price:</p>
        <div className="flex items-center gap-2">
          <TfiTarget />
          <p className="text-lg font-medium">{instrument.targetPrice}</p>
        </div>
      </div>

      <p className="p-2 text-center">Time: {instrument.orderTime}</p>
    </div>
  );
};

export default SignalCard;


