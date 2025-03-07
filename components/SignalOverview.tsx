import { useTranslations } from "next-intl";
import SignalCard from "./SignalCard/SignalCard";
import SignalSummaryStats from "./SignalSummaryStats";
import SignalStatusBar from "./SignalStatusBar";

const SignalOverview = ({ signalPassed, instrumentData }) => {
  const t = useTranslations("SignalOverviewSummary");

  if (!signalPassed || !instrumentData) {
    return <div className="p-6 text-center text-slate-400">{t("noData")}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-5 rounded-xl border border-slate-700/50 bg-slate-800/90 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
      <SignalStatusBar instrumentName={signalPassed.instrument_name} />
      <div className="w-full">
        <SignalCard signalPassed={signalPassed} />
      </div>
      <SignalSummaryStats instrumentData={instrumentData} />
    </div>
  );
};

export default SignalOverview;
