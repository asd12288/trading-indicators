"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { HiArrowRight } from "react-icons/hi";
import DemoCard from "./DemoCard";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Lazy-load these heavier components
const TimelineSection = dynamic(() => import("./TimelineSection"), {
  ssr: false,
});
const LogosScroling = dynamic(() => import("@/components/LogosScroling"), {
  ssr: false,
});

const Hero = () => {
  const t = useTranslations("HomePage.hero");

  return (
    <section className="overflow-hidden">
      <div className="flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 md:grid md:min-h-[85vh] md:grid-cols-12 md:gap-4 md:px-6 lg:px-12">
        {/* LEFT COLUMN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-8 w-full px-4 py-4 md:col-span-6 md:py-20 md:pl-8 lg:pl-16 xl:py-28"
        >
          <div className="inline-block rounded-full bg-emerald-900/30 px-4 py-1 backdrop-blur-sm">
            <p className="text-center text-sm text-emerald-400 md:text-left">
              {t("rating")}
            </p>
          </div>

          <p className="my-3 text-center font-thin text-slate-400 md:text-left">
            {t("count")}
          </p>

          <h1 className="text-center text-4xl font-bold text-gray-50 md:text-left md:text-5xl lg:text-6xl xl:text-7xl">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Smart Alert
            </span>{" "}
            <br />
            {t("mainTitleStart")}
          </h1>

          <h2 className="mt-6 text-center text-lg font-light text-slate-300 md:text-left md:text-2xl lg:text-3xl">
            {t("highlightedText")}
          </h2>

          <div className="mt-10 flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-start">
            <Link href="/signup">
              <div className="flex flex-col items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-3 shadow-lg shadow-emerald-900/30 transition-all hover:from-emerald-500 hover:to-teal-600 md:px-8 md:py-3 md:font-medium lg:text-xl"
                >
                  {t("buttons.joinUs")}{" "}
                  <span className="ml-1">
                    <HiArrowRight className="inline" />
                  </span>
                </motion.button>
                <p className="text-xs font-light text-slate-400">
                  {t("noCard")}
                </p>
              </div>
            </Link>

            <Link href="/info">
              <button className="group px-3 py-2 text-sm transition-all md:px-4 md:py-3 md:font-medium lg:text-lg">
                {t("buttons.learnMore")}
                <span className="block h-0.5 max-w-0 bg-green-400 transition-all duration-500 group-hover:max-w-full"></span>
              </button>
            </Link>
          </div>
        </motion.div>

        {/* RIGHT COLUMN */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="my-4 w-full md:col-span-6 md:flex md:items-center md:justify-center lg:mt-12"
        >
          {/* Parent must be relative for absolute positioning inside */}
          <div className="w-full items-center justify-center md:relative lg:flex">
            {/* A container to hold both cards, one behind the other */}
            <div className="xs:grid grid-cols-2 md:relative">
              <div className="relative z-10 transform transition-all hover:rotate-2 hover:scale-105">
                <DemoCard type="es" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <LogosScroling />
    </section>
  );
};

export default Hero;
