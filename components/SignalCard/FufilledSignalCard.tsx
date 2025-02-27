import { Signal } from "@/lib/types";
import {
  format,
  formatDistance,
  formatDistanceToNow,
  parseISO,
} from "date-fns";
import { useTranslations } from "next-intl";
import { FaLock } from "react-icons/fa";
import { RxEnter, RxExit } from "react-icons/rx";

interface FufilledSignalCardProps {
  instrument: Signal;
  isBuy: boolean;
}

const FufilledSignalCard: React.FC<FufilledSignalCardProps> = ({
  instrument,
  isBuy,
}) => {
  const {
    instrument_name,
    trade_side,
    entry_price,
    exit_price,
    exit_time,
    mae,
    mfe,
    entry_time,
  } = instrument;

  const t = useTranslations("FufilledSignalCard");

  if (!exit_time) {
    return null;
  }

  const exitTimeInUserTimezone = parseISO(exit_time);
  const adjustedExitTime = new Date(exitTimeInUserTimezone.getTime());
  const start = parseISO(entry_time);
  const end = parseISO(exit_time);
  const tradeDuration = formatDistance(start, end); // always a positive, readable string

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
            {t("finished")}
            <br />
            {timeAgo}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <h3
            className={`text-2xl font-semibold ${
              isBuy ? "text-green-100" : "text-red-100"
            }`}
          >
            {t("close")}
          </h3>
        </div>
      </div>

      <div className="flex justify-between border-b-2 border-slate-700 p-4">
        <p>{t("status")}</p>
        <div className="flex items-center gap-2">
          <FaLock />
          <p>{t("tradeOver")}</p>
        </div>
      </div>

      <div className="flex justify-between border-b-2 border-slate-700 p-4">
        <p>{t("entryPrice")}</p>
        <div className="flex items-center gap-2">
          <RxEnter />
          <p className="text-lg font-medium">{entry_price}</p>
        </div>
      </div>

      <div className="flex justify-between border-b-2 border-slate-700 p-4">
        <p>{t("exitPrice")}</p>
        <div className="flex items-center gap-2">
          <RxExit />
          <p className="text-lg font-medium">{exit_price}</p>
        </div>
      </div>

      <div className="flex justify-between border-b-2 border-slate-500 p-4">
        <div className="flex items-center gap-2">
          <p>{t("mae")}</p>
          <p className="text-lg font-medium">{mae.toFixed(0)}</p>
        </div>
        <div className="flex items-center gap-2">
          <p>{t("mfe")}</p>
          <p className="text-lg font-medium">{mfe.toFixed(0)}</p>
        </div>
      </div>

      <p className="p-2 text-center">
        {t("tradeDuration")} {tradeDuration}
      </p>
      <div className="border-b-2 border-slate-700"></div>
      <p className="p-2 text-center">
        {t("startedAt")} {format(parseISO(exit_time), "MM/dd -  HH:mm")}
      </p>
    </div>
  );
};

export default FufilledSignalCard;
