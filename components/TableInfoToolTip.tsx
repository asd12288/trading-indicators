import React, { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useTranslations } from "next-intl";

const TableInfoToolTip = ({
  children,
  type,
}: {
  children: ReactNode;
  type: string;
}) => {
  const t = useTranslations("SignalTable.tooltips");

  const getTooltipContent = (type: string) => {
    switch (type) {
      case "maeTicks":
        return "Maximum Adverse Excursion - The largest negative movement against your position during the trade lifecycle";
      default:
        return t(type);
    }
  };

  const text = getTooltipContent(type);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="max-w-[280px] text-center text-sm leading-6">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TableInfoToolTip;
