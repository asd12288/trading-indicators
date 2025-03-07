"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { BackgroundGradient } from "./ui/background-gradient";
import Benefit from "./smallComponents/Benefit";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";

const PlanCard = () => {
  const t = useTranslations("HomePage.proPlanCard");

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
    >
      <BackgroundGradient className="relative overflow-hidden rounded-xl border-4 border-green-400/60 p-8 shadow-2xl">
        {/* Floating Label */}
        <div className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-green-600 to-green-500 px-3 py-1 text-xs font-medium text-white shadow-lg">
          Best Value
        </div>

        <div className="relative">
          <span className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-green-400/10 blur-xl"></span>
          <h3 className="bg-gradient-to-r from-green-400 to-teal-300 bg-clip-text text-4xl font-bold text-transparent">
            {t("plan")}
          </h3>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <h4 className="text-5xl font-extrabold text-white">$35</h4>
          <p className="text-sm text-green-300">{t("frequency")}</p>
        </div>
        <p className="text-sm text-slate-400">{t("billed")}</p>

        <ul className="mt-6 space-y-4" aria-label="Pro plan benefits">
          <li>
            <Benefit benefit={t("benefit1")} />
          </li>
          <li>
            <Benefit benefit={t("benefit2")} />
          </li>
          <li>
            <Benefit benefit={t("benefit3")} />
          </li>
          <li>
            <Benefit benefit={t("benefit4")} />
          </li>
          <li>
            <Benefit benefit={t("benefit5")} />
          </li>
        </ul>

        <Link href={"/signup"}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 w-full rounded-lg bg-gradient-to-r from-green-600 to-green-800 px-6 py-3 text-lg font-medium text-white shadow-lg transition"
          >
            {t("button")}
          </motion.button>
        </Link>
      </BackgroundGradient>
    </motion.div>
  );
};

export default React.memo(PlanCard);
