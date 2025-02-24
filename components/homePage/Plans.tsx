import Link from "next/link";
import React from "react";
import FreePlanCard from "./FreePlanCard";
import PlanCard from "../PlanCard";
import { useTranslations } from "next-intl";

const Plans = ({ size = "regular" }) => {
  const t = useTranslations("HomePage.plans");

  return (
    <section className="flex flex-col items-center justify-center space-y-4 md:space-y-8">
      <h2 className="text-center text-3xl font-semibold md:text-5xl">
        {t("title")}
      </h2>
      <p className="mt-4 text-center text-xl font-light md:text-2xl">
        {t("subtitle")}
      </p>
      <div className="mt-8 grid grid-cols-1 items-center gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
        <FreePlanCard />
        <PlanCard />
      </div>
      <Link href="/login">
        <p className="mt-8 text-center font-thin hover:underline">
          {t("loginPrompt")}
        </p>
      </Link>
    </section>
  );
};

export default Plans;
