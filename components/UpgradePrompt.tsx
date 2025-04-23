import React from "react";
import { Sparkles, Check } from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const UpgradePrompt = () => {
  const t = useTranslations("UpgradePrompt");

  // Hard-code features rather than relying on translations initially
  const features = [
    t("features.access"),
    t("features.alerts"),
    t("features.filters"),
    t("features.support"),
  ];

  return (
    <motion.div
      className="mb-8 overflow-visible rounded-lg border border-blue-500/20 bg-gradient-to-br from-slate-800 to-blue-900/30 p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left">
        <div className="mb-6 flex-1 md:mb-0 md:pr-6">
          <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <h3 className="text-xl font-bold text-white">{t("title")}</h3>
          </div>

          <p className="mb-4 text-slate-300">{t("description")}</p>

          <ul className="mb-6 space-y-2 text-sm">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                <span className="text-slate-200">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="mb-3 text-center">
            <span className="text-3xl font-bold text-white">$65</span>
            <span className="text-slate-400">/month</span>
          </div>

          <Link href="/profile?tab=upgrade">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30"
            >
              {t("button")}
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default UpgradePrompt;
