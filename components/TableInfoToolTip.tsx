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

  const text = t(type);

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
