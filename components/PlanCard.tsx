import React from "react";
import Benefit from "./smallComponents/Benefit";
import Link from "next/link";
import { useTranslations } from "next-intl";

const PlanCard = () => {
  const t = useTranslations("HomePage.proPlanCard");

  return (
    <div className="space-y-6 rounded-lg bg-slate-800 p-8">
      <h3 className="text-2xl font-medium md:text-4xl">{t("plan")}</h3>
      <div className="flex items-baseline gap-2">
        <h4 className="text-4xl font-semibold md:text-5xl">65$</h4>
        <p className="text-sm md:text-lg">{t("frequency")}</p>
      </div>
      <p className="text-sm text-gray-400">{t("billed")}</p>
      <ul className="tmd:text-lg space-y-4 text-sm">
        <Benefit benefit={t("benefit1")} />
        <Benefit benefit={t("benefit2")} />
        <Benefit benefit={t("benefit3")} />
        <Benefit benefit={t("benefit4")} />
        <Benefit benefit={t("benefit5")} />
      </ul>
      <Link href={"/signup"}>
        <button className="mt-4 w-full rounded-lg bg-green-800 px-2 py-2 hover:bg-green-900">
          Get started
        </button>
      </Link>
    </div>
  );
};

export default PlanCard;
