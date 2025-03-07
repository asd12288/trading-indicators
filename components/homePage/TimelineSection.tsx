"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Timeline } from "@/components/ui/timeline";
import { FiBarChart2, FiAlertCircle, FiBell } from "react-icons/fi";

const TimelineSection = () => {
  const t = useTranslations("HomePage.timelineSection");

  // Create timeline data with React components as content
  const timelineData = [
    {
      title: t("items.0.title"),
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-full bg-slate-800 p-3">
              <FiBarChart2 className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-slate-300">{t("items.0.content")}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-400">
                <li>Technical analysis patterns</li>
                <li>Price action signals</li>
                <li>Volume analysis</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t("items.1.title"),
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-full bg-slate-800 p-3">
              <FiAlertCircle className="h-6 w-6 text-cyan-500" />
            </div>
            <div>
              <p className="text-slate-300">{t("items.1.content")}</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-sm">
                  <span className="font-medium text-emerald-400">
                    Entry points
                  </span>
                  <p className="mt-1 text-slate-400">
                    Precise market entry timing
                  </p>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-sm">
                  <span className="font-medium text-emerald-400">
                    Stop loss
                  </span>
                  <p className="mt-1 text-slate-400">Risk management levels</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t("items.2.title"),
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-full bg-slate-800 p-3">
              <FiBell className="h-6 w-6 text-teal-500" />
            </div>
            <div>
              <p className="text-slate-300">{t("items.2.content")}</p>
              <div className="mt-4">
                <div className="flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span className="text-sm text-slate-300">
                    Average response time:{" "}
                    <span className="font-medium text-emerald-400">
                      2.5 seconds
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-slate-950 py-20 text-white">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold leading-tight md:text-5xl">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h2>
          <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-emerald-500/30"></div>
        </motion.div>

        <Timeline data={timelineData} />
      </div>
    </div>
  );
};

export default TimelineSection;
