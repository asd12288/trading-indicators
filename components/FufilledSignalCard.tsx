import { formatDistanceToNow } from "date-fns";
import React from "react";
import { FaCheck } from "react-icons/fa";
import { RxEnter, RxExit } from "react-icons/rx";
import { TfiTarget } from "react-icons/tfi";
import { FormattedTime } from "./FormattedTime";

const FufilledSignalCard = ({ instrument, isBuy, orderEnd }) => {
  return (
    <div className="min-h-24 w-72 rounded-sm bg-slate-900">
      <div
        className={`flex items-center justify-between ${
          isBuy ? "bg-green-950" : "bg-red-950"
        } p-4`}
      >
        <div>
          <h3 className="text-2xl font-semibold">{instrument.instrument}</h3>
          <p className="text-xs">
            Finished:{" "}
            {formatDistanceToNow(new Date(orderEnd.time), {
              addSuffix: true,
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <h3
            className={`text-2xl font-semibold ${isBuy ? "text-green-100" : "text-red-100"}`}
          >
            FUFIELD
          </h3>
        </div>
      </div>

      <div className="flex justify-between border-b-2 border-slate-700 p-4">
        <p>Status:</p>

        <div className="flex items-center gap-2">
          <FaCheck />
          <p>{instrument.status ? "Active" : "no"}</p>
        </div>
      </div>

      <div className="flex justify-between border-b-2 border-slate-700 p-4">
        <p>Entry Price:</p>
        <div className="flex items-center gap-2">
          <RxEnter />
          <p className="text-lg font-medium">{instrument.entryprice}</p>
        </div>
      </div>

      <div className="flex justify-between border-b-2 border-slate-700 p-4">
        <p>Exit Price:</p>
        <div className="flex items-center gap-2">
          <RxExit />
          <p className="text-lg font-medium">{orderEnd.exitPrice}</p>
        </div>
      </div>

      <div className="flex justify-between border-b-2 border-slate-500 p-4">
        <p>Gain (Ticks)</p>
        <div className="flex items-center gap-2">
          <TfiTarget />
          <p className="text-lg font-medium">
            {orderEnd.exitGain}
            {orderEnd.exitGain > 0 ? "+" : "-"}
          </p>
        </div>
      </div>

      <p className="p-2 text-center">
        Time: <FormattedTime date={instrument.orderTime} />
      </p>
    </div>
  );
};

export default FufilledSignalCard;
