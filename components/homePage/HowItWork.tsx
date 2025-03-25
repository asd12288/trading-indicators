"use client";

import React from "react";
import { Timeline } from "../ui/timeline";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRightIcon,
  BarChart2Icon,
  GaugeIcon,
  AlertCircleIcon,
  ActivityIcon,
} from "lucide-react";
import { Link } from "@/i18n/routing";

type TimelineEntry = {
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
};

const HowItWork = () => {
  const t = useTranslations("HomePage.howItWork");

  const data: TimelineEntry[] = [
    {
      title: t("monitoring.title"),
      icon: (
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 sm:h-10 sm:w-10">
          <GaugeIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white sm:-right-2 sm:-top-2 sm:h-5 sm:w-5 sm:text-xs">
            1
          </span>
        </div>
      ),
      content: (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3 rounded-lg border border-slate-700/30 bg-gradient-to-br from-slate-800/80 to-slate-900 p-4 shadow-lg sm:space-y-4 sm:rounded-xl sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center">
            <div className="flex-1 space-y-2 sm:space-y-3">
              <h3 className="text-lg font-semibold text-indigo-100 sm:text-xl md:text-3xl">
                {t("monitoring.heading")}
              </h3>
              <p className="text-xs text-slate-300 sm:text-sm md:text-base">
                {t("monitoring.description")}
              </p>

              <ul className="mt-3 space-y-1.5 text-xs text-slate-300 sm:mt-4 sm:space-y-2 sm:text-sm">
                <li className="flex items-start">
                  <span className="mr-1.5 mt-1 text-blue-400 sm:mr-2">•</span>
                  <span>Real-time market data analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5 mt-1 text-blue-400 sm:mr-2">•</span>
                  <span>Continuous price movement tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5 mt-1 text-blue-400 sm:mr-2">•</span>
                  <span>Multiple exchanges monitored simultaneously</span>
                </li>
              </ul>
            </div>

            <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-lg md:h-64 md:w-80">
              <Image
                src="/images/market-monitoring.png"
                alt="Market monitoring dashboard"
                className="rounded-lg object-cover"
                width={400}
                height={300}
                priority={false}
              />
              <div className="absolute bottom-2 right-2 rounded-full bg-blue-600/80 p-1.5 backdrop-blur-sm sm:bottom-3 sm:right-3 sm:p-2">
                <ActivityIcon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-1 sm:pt-2">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-blue-400"
            >
              <ArrowRightIcon className="h-6 w-6 sm:h-8 sm:w-8" />
            </motion.div>
          </div>
        </motion.div>
      ),
    },
    {
      title: t("analysis.title"),
      icon: (
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/20 text-teal-400 sm:h-10 sm:w-10">
          <BarChart2Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white sm:-right-2 sm:-top-2 sm:h-5 sm:w-5 sm:text-xs">
            2
          </span>
        </div>
      ),
      content: (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3 rounded-lg border border-slate-700/30 bg-gradient-to-br from-slate-800/80 to-slate-900 p-4 shadow-lg sm:space-y-4 sm:rounded-xl sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center">
            <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-lg md:order-first md:h-64 md:w-80">
              <Image
                src="/images/data-analysis.png"
                alt="Advanced data analysis with charts and indicators"
                className="rounded-lg object-cover"
                width={400}
                height={300}
                priority={false}
              />
              <div className="absolute bottom-2 right-2 rounded-full bg-teal-600/80 p-1.5 backdrop-blur-sm sm:bottom-3 sm:right-3 sm:p-2">
                <BarChart2Icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
            </div>

            <div className="flex-1 space-y-2 sm:space-y-3">
              <h3 className="text-lg font-semibold text-teal-100 sm:text-xl md:text-3xl">
                {t("analysis.heading")}
              </h3>
              <p className="text-xs text-slate-300 sm:text-sm md:text-base">
                {t("analysis.description")}
              </p>

              <ul className="mt-3 space-y-1.5 text-xs text-slate-300 sm:mt-4 sm:space-y-2 sm:text-sm">
                <li className="flex items-start">
                  <span className="mr-1.5 mt-1 text-teal-400 sm:mr-2">•</span>
                  <span>Pattern recognition algorithms</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5 mt-1 text-teal-400 sm:mr-2">•</span>
                  <span>Trend strength evaluation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5 mt-1 text-teal-400 sm:mr-2">•</span>
                  <span>Historical performance correlation</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center pt-1 sm:pt-2">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-teal-400"
            >
              <ArrowRightIcon className="h-6 w-6 sm:h-8 sm:w-8" />
            </motion.div>
          </div>
        </motion.div>
      ),
    },
    {
      title: t("alertGeneration.title"),
      icon: (
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 sm:h-10 sm:w-10">
          <AlertCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white sm:-right-2 sm:-top-2 sm:h-5 sm:w-5 sm:text-xs">
            3
          </span>
        </div>
      ),
      content: (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3 rounded-lg border border-slate-700/30 bg-gradient-to-br from-slate-800/80 to-slate-900 p-4 shadow-lg sm:space-y-4 sm:rounded-xl sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center">
            <div className="flex-1 space-y-2 sm:space-y-3">
              <h3 className="text-lg font-semibold text-amber-100 sm:text-xl md:text-3xl">
                {t("alertGeneration.heading")}
              </h3>
              <p className="text-xs text-slate-300 sm:text-sm md:text-base">
                {t("alertGeneration.description")}
              </p>

              <ul className="mt-3 space-y-1.5 text-xs text-slate-300 sm:mt-4 sm:space-y-2 sm:text-sm">
                <li className="flex items-start">
                  <span className="mr-1.5 mt-1 text-amber-400 sm:mr-2">•</span>
                  <span>Instant trading notifications</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5 mt-1 text-amber-400 sm:mr-2">•</span>
                  <span>Multi-channel delivery (app, email, SMS)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5 mt-1 text-amber-400 sm:mr-2">•</span>
                  <span>Detailed entry and exit points</span>
                </li>
              </ul>
            </div>

            <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-lg md:h-64 md:w-80">
              <Image
                src="/images/smart-alerts.png"
                alt="Smart trading alerts on multiple devices"
                className="rounded-lg object-cover"
                width={400}
                height={300}
                priority={false}
              />
              <div className="absolute bottom-2 right-2 rounded-full bg-amber-600/80 p-1.5 backdrop-blur-sm sm:bottom-3 sm:right-3 sm:p-2">
                <AlertCircleIcon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center space-x-3 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-3 sm:mt-8 sm:space-x-4 sm:rounded-xl sm:p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/30 sm:h-12 sm:w-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-green-400 sm:h-6 sm:w-6"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <p className="flex-1 text-center text-xs font-medium text-green-300 sm:text-sm md:text-base">
              Your trading opportunity is ready - all you need to do is execute!
            </p>
          </div>
        </motion.div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-10 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-8 text-center sm:mb-12"
      >
        <span className="inline-block rounded-full bg-slate-700/60 px-2.5 py-0.5 text-xs font-medium text-slate-200 sm:px-3 sm:py-1 sm:text-sm">
          Smart Process
        </span>
        <h2 className="section-title mb-4 mt-3 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-3xl font-bold text-transparent sm:mb-6 sm:mt-4 sm:text-4xl md:text-5xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 sm:mt-4 sm:text-base md:text-lg">
          Our system continuously monitors markets, analyzes price movements,
          and delivers actionable alerts - all automated to give you the trading
          edge.
        </p>
        <div className="mx-auto mt-5 h-1 w-12 rounded-full bg-indigo-500/50 sm:mt-6 sm:w-16"></div>
      </motion.div>

      <div className="relative z-10">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-transparent to-indigo-500/10 blur-3xl sm:rounded-3xl"></div>
        <div className="relative z-20 p-3 sm:p-4 md:p-8">
          <Timeline data={data} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mx-auto mt-8 max-w-xl rounded-lg border border-slate-700/30 bg-slate-800/50 p-4 text-center shadow-lg backdrop-blur-sm sm:mt-12 sm:rounded-xl sm:p-6"
        >
          <h3 className="text-base font-medium text-white sm:text-lg md:text-xl">
            Ready to experience the power of Smart Alerts?
          </h3>
          <p className="mt-2 text-xs text-slate-300 sm:mt-3 sm:text-sm">
            Our system handles the complex market analysis so you can focus on
            making successful trades.
          </p>
          <Link href="/signup">
            <button className="mt-4 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-2.5 text-sm text-white shadow-lg transition-transform hover:scale-105 sm:mt-6 sm:px-8 sm:py-3 sm:text-base">
              Get Started Now
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(HowItWork);
