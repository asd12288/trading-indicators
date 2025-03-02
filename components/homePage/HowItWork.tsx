import React from "react";
import { Timeline } from "../ui/timeline";
import { useTranslations } from "next-intl";

type TimelineEntry = {
  title: string;
  content: React.ReactNode;
};

const HowItWork = () => {
  const t = useTranslations("HomePage.howItWork");
  
  const data: TimelineEntry[] = [
    {
      title: t("monitoring.title"),
      content: (
        <div className="space-y-2 md:px-24">
          <h3 className="text-xl font-semibold md:text-3xl">
            {t("monitoring.heading")}
          </h3>
          <p className="text-xs md:text-lg">
            {t("monitoring.description")}
          </p>
        </div>
      ),
    },
    {
      title: t("analysis.title"),
      content: (
        <div className="space-y-2 md:px-24">
          <h3 className="text-xl font-semibold md:text-3xl">
            {t("analysis.heading")}
          </h3>
          <p className="text-xs md:text-lg">
            {t("analysis.description")}
          </p>
        </div>
      ),
    },
    {
      title: t("alertGeneration.title"),
      content: (
        <div className="space-y-2 md:px-24">
          <h3 className="text-xl font-semibold md:text-3xl">
            {t("alertGeneration.heading")}
          </h3>
          <p className="text-xs md:text-lg">
            {t("alertGeneration.description")}
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-16 md:mt-10">
      <h2 className="section-title">{t("title")}</h2>
      <Timeline data={data} />
    </div>
  );
};

export default HowItWork;