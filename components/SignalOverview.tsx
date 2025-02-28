import { useTranslations } from "next-intl";
import SignalCard from "./SignalCard/SignalCard";
import SignalSummaryStats from "./SignalSummaryStats";

const SignalOverview = ({ signalPassed, instrumentData }) => {
  const t = useTranslations("SignalOverviewSummary");

  if (!signalPassed || !instrumentData) {
    return <div>{t("noData")}</div>;
  }

  return (
    <div className="flex flex-col space-y-6">
      <SignalSummaryStats data={instrumentData} />

      <SignalCard signalPassed={signalPassed} />
    </div>
  );
};

export default SignalOverview;
