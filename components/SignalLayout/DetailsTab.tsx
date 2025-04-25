"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TabContentProps } from "./types";
import BlurOverlay from "../BlurOverlay";
import SignalInfo from "../SignalInfo";
import { useTranslations } from "next-intl";

export default function DetailsTab({
  theme,
  instrumentName,
  isPro,
  handleUpgradeClick,
}: TabContentProps) {
  const t = useTranslations("SignalLayout");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative overflow-hidden rounded-xl border shadow-lg transition-all duration-300 hover:shadow-xl",
        theme === "dark"
          ? "border-slate-700/50 bg-slate-800/90 backdrop-blur-sm"
          : "border-slate-200 bg-white",
      )}
    >
      {!isPro && (
        <BlurOverlay
          title={t("premium.detailsTitle")}
          description={t("premium.detailsDescription")}
          onUpgradeClick={handleUpgradeClick}
        />
      )}
      <div className={!isPro ? "blur-sm" : ""}>
        <SignalInfo instrumentName={instrumentName} />
      </div>
    </motion.div>
  );
}
