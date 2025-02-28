import { useTranslations } from "next-intl";
import SignalCard from "./SignalCard/SignalCard";
import SignalSummaryStats from "./SignalSummaryStats";
import SignalStatusBar from "./SignalStatusBar";

const SignalOverview = ({ signalPassed, instrumentData }) => {
  const t = useTranslations("SignalOverviewSummary");

  if (!signalPassed || !instrumentData) {
    return <div>{t("noData")}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center space-y-4 bg-slate-800 rounded-2xl p-4 shadow-lg">
      <SignalStatusBar instrumentName={signalPassed.instrument_name} />
      <SignalCard signalPassed={signalPassed} />
    </div>
  );
};

export default SignalOverview;
