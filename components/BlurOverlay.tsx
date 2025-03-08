import React from "react";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface BlurOverlayProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onUpgradeClick?: () => void;
}

const BlurOverlay: React.FC<BlurOverlayProps> = ({
  title,
  description,
  buttonText,
  onUpgradeClick,
}) => {
  const t = useTranslations("BlurOverlay");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-md"
    >
      <div className="max-w-md rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-900/95 p-6 shadow-2xl backdrop-blur-lg">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-blue-900/30 p-4">
            <Sparkles className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <h3 className="mb-2 text-center text-2xl font-bold text-white">
          {title || t("title")}
        </h3>

        <p className="mb-6 text-center text-slate-300">
          {description || t("description")}
        </p>

        <button
          onClick={onUpgradeClick}
          className="mx-auto flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-medium text-white transition-all hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          {buttonText || t("upgradeButton")}
        </button>
      </div>
    </motion.div>
  );
};

export default BlurOverlay;
