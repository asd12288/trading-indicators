import React from "react";
import SignalCard from "./SignalCard/SignalCard";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const FavoriteSignals = ({ favouriteSignals }) => {
  const t = useTranslations("Signals");
  return (
    <>
      <h2 className="my-4 text-center text-2xl font-medium">
        {t("titleFavor")}
      </h2>
      <div
        className={`flex flex-col justify-center gap-8 md:grid md:grid-cols-3`}
      >
        {favouriteSignals.map((signal) => (
          <Link
            key={signal.client_trade_id}
            href={`/signals/${encodeURIComponent(signal.instrument_name)}`}
            className="flex justify-center"
          >
            <SignalCard signalPassed={signal} />
          </Link>
        ))}
      </div>
      <div className="my-8 w-full border-2 border-slate-400"></div>
    </>
  );
};

export default FavoriteSignals;
