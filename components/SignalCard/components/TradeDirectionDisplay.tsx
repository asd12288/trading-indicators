import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface TradeDirectionDisplayProps {
  isBuy: boolean;
}

const TradeDirectionDisplay: FC<TradeDirectionDisplayProps> = ({ isBuy }) => {
  const t = useTranslations("RunningSignalCard");

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md py-2",
        isBuy
          ? "bg-emerald-900/20 text-emerald-400"
          : "bg-rose-900/20 text-rose-400",
      )}
    >
      {isBuy ? (
        <ArrowUp className="mr-1 h-4 w-4" />
      ) : (
        <ArrowDown className="mr-1 h-4 w-4" />
      )}
      <span className="font-medium">{isBuy ? t("long") : t("short")}</span>
    </div>
  );
};

export default TradeDirectionDisplay;
