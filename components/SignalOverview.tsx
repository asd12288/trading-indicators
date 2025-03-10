import { useTranslations } from "next-intl";
import SignalCard from "./SignalCard/SignalCard";
import SignalHoursInfo from "./SignalHoursInfo";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/theme-context";

const SignalOverview = ({ signalPassed, instrumentData }) => {
  const t = useTranslations("SignalOverviewSummary");
  const { theme } = useTheme();

  if (!signalPassed || !instrumentData) {
    return (
      <div className="flex min-h-[600px] items-center justify-center p-6 text-center text-slate-400">
        {t("noData")}
      </div>
    );
  }

  // We've moved the content structure to the SignalLayout component
  // This component now just renders the SignalCard directly
  return (
    <div className="w-full">
      <SignalCard signalPassed={signalPassed} />
    </div>
  );
};

export default SignalOverview;
