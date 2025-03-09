"use client";

import { Link } from "@/i18n/routing";
import React from "react";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { motion } from "framer-motion";
import AlertNotification from "./AlertNotification";
import SignalsList from "./SignalCard/SignalsList";
import EconomicCalendar from "./EconomicCalendar";

const SignalsLayout = ({ userId }) => {
  const t = useTranslations("Signals");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 px-3 sm:px-4 md:px-6 lg:px-8"
    >
      <div className="mx-auto w-full rounded-xl border border-slate-700/20 bg-gradient-to-b from-slate-800 to-slate-900 p-4 shadow-lg sm:p-6 lg:p-8">
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-2xl font-medium text-transparent md:text-3xl">
              {t("mainTitle", { fallback: "Trading Signals" })}
            </h2>
            <Link href="/info">
              <motion.div className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-light text-slate-300 hover:bg-slate-700/40 hover:text-white">
                <Info size={16} />
                {t("infoLink", { fallback: "Learn More" })}
              </motion.div>
            </Link>
          </div>
        </div>

        <motion.div
          className="mt-6 rounded-lg border border-slate-600/30 bg-slate-700/50 p-4 shadow-inner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AlertNotification userId={userId} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <SignalsList userId={userId} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignalsLayout;
