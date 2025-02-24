import { format, formatDistanceToNow, parseISO } from "date-fns";
import { FaLock, FaTrophy } from "react-icons/fa";
import { RxEnter, RxExit } from "react-icons/rx";
import { motion } from "framer-motion";

const FufilledSignalCard = ({ instrument, isBuy }) => {
  const {
    instrument_name,
    trade_side,
    entry_price,
    exit_price,
    result_ticks,
    trade_duration,
    exit_time,
    mae,
    mfe,
  } = instrument;

  const exitTimeInUserTimezone = parseISO(exit_time);

  const adjustedExitTime = new Date(exitTimeInUserTimezone.getTime());

  // Calculate how long ago the trade finished
  const timeAgo = formatDistanceToNow(adjustedExitTime, {
    addSuffix: true,
    includeSeconds: true,
  });

  return (
    <div className="h-[26rem] w-72 rounded-lg bg-slate-900">
      <div
        className={`flex items-center justify-between ${
          isBuy ? "bg-green-950" : "bg-red-950"
        } p-4`}
      >
        <div>
          <h3 className="text-2xl font-semibold">
            {instrument_name}
            <span> - {trade_side}</span>
          </h3>
          <p className="text-xs">
            Finished:
            <br />
            {timeAgo}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <h3
            className={`text-2xl font-semibold ${isBuy ? "text-green-100" : "text-red-100"}`}
          >
            Close
          </h3>
        </div>
      </div>

      <div className="flex justify-between border-b-2 border-slate-700 p-4">
        <p>Status: </p>

        <div className="flex items-center gap-2">
          <FaLock />
          <p>Trade Over</p>
        </div>
      </div>

      <div className="flex justify-between border-b-2 border-slate-700 p-4">
        <p>Entry Price:</p>
        <div className="flex items-center gap-2">
          <RxEnter />
          <p className="text-lg font-medium">{entry_price}</p>
        </div>
      </div>

      <div className="flex justify-between border-b-2 border-slate-700 p-4">
        <p>Exit Price:</p>
        <div className="flex items-center gap-2">
          <RxExit />
          <p className="text-lg font-medium">{exit_price}</p>
        </div>
      </div>

      <div className="flex justify-between border-b-2 border-slate-500 p-4">
        <div className="flex items-center gap-2">
          <p>MAE:</p>
          <p className="text-lg font-medium">{mae.toFixed(0)}</p>
        </div>
        <div className="flex items-center gap-2">
          <p>MFE:</p>
          <p className="text-lg font-medium">{mfe.toFixed(0)}</p>
        </div>
      </div>

      <p className="p-2 text-center">Trade Duration: {trade_duration}</p>
      <div className="border-b-2 border-slate-700"></div>
      <p className="p-2 text-center">
        Started at: {format(parseISO(exit_time), "MM/dd -  HH:mm")}
      </p>
    </div>
  );
};

export default FufilledSignalCard;
