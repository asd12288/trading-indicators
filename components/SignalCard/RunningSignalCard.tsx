import { format, formatDistanceToNow, parseISO } from "date-fns";
import React from "react";
import { FaArrowDown, FaArrowUp, FaCheck } from "react-icons/fa";
import { RxEnter } from "react-icons/rx";
import { TbHandStop } from "react-icons/tb";
import { TfiTarget } from "react-icons/tfi";
import { motion } from "framer-motion";
import SignalContextMenu from "./SignalContextMenu";

const RunningSignalCard = ({ instrument, isBuy }) => {
  const {
    entry_time,
    instrument_name,
    trade_side,
    entry_price,
    exit_price,
    take_profit_price,
    stop_loss_price,
    client_trade_id,
    
  } = instrument;

  const exitTimeInUserTimezone = parseISO(entry_time);

  const adjustedExitTime = new Date(
    exitTimeInUserTimezone.getTime() - 2 * 60 * 60 * 1000,
  );

  return (
   
      <motion.div
        whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
        className="h-[26rem] w-72 bg-slate-900"
      >
        <div
          className={`flex min-h-24 items-center justify-between ${
            isBuy ? "bg-green-700" : "bg-red-700"
          } p-4`}
        >
          <div>
            <h3 className="text-2xl font-semibold">{instrument_name}</h3>
            <p className="text-xs">
              Started:
              <br />
              {formatDistanceToNow(adjustedExitTime, { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p
              className={`text-2xl font-bold ${isBuy ? "text-green-200" : "text-red-200"}`}
            >
              {trade_side}
            </p>
            {isBuy ? (
              <FaArrowUp
                className={`animate-bounce text-4xl ${isBuy ? "text-green-200" : "text-red-200"}`}
              />
            ) : (
              <FaArrowDown
                className={`animate-bounce text-4xl ${isBuy ? "text-green-200" : "text-red-200"}`}
              />
            )}
          </div>
        </div>
        <div className="flex justify-between border-b-2 border-slate-500 p-4">
          <p className="">Status:</p>

          <div className="flex animate-pulse items-center gap-2">
            <FaCheck />
            <p className="">{exit_price ? "No Activiated" : "Running"}</p>
          </div>
        </div>
        <div className="flex justify-between border-b-2 border-slate-500 p-4">
          <p>Enrty Price:</p>
          <div className="flex items-center gap-2">
            <RxEnter />
            <p className="text-lg font-medium">{entry_price}</p>
          </div>
        </div>
        <div className="flex justify-between border-b-2 border-slate-500 p-4">
          <p>Invalidation</p>
          <div className="flex items-center gap-2">
            <TbHandStop />
            <p className="text-lg font-medium">{stop_loss_price}</p>
          </div>
        </div>
        <div className="flex justify-between border-b-2 border-slate-500 p-4">
          <p>Objectif</p>
          <div className="flex items-center gap-2">
            <TfiTarget />
            <p className="text-lg font-medium">{take_profit_price}</p>
          </div>
        </div>

        <p className="p-2 text-center">Trade Duration: {""}</p>
        <div className="border-b-2 border-slate-700"></div>
        <p className="p-2 text-center">
          Started at: {format(parseISO(entry_time), "MM/dd -  HH:mm")}
        </p>
      </motion.div>
  
  );
};

export default RunningSignalCard;
