import { useTranslations } from "next-intl";
import SignalCard from "./SignalCard/SignalCard";
import SignalSummaryStats from "./SignalSummaryStats";
import SignalStatusBar from "./SignalStatusBar";

const SignalOverview = ({ signalPassed, instrumentData }) => {
  const t = useTranslations("SignalOverviewSummary");

  if (!signalPassed || !instrumentData) {
    return (
      <div className="flex h-[600px] items-center justify-center p-6 text-center text-slate-400">
        {t("noData")}
      </div>
    );
  }

  return (
    <div className="flex h-[600px] w-full flex-col space-y-5 p-6">
      <SignalStatusBar instrumentName={signalPassed.instrument_name} />
      <div className="w-full">
        <SignalCard signalPassed={signalPassed} />
      </div>
      <div className="flex-grow">
        <SignalSummaryStats instrumentData={instrumentData} />
      </div>
    </div>
  );
};

export default SignalOverview;
