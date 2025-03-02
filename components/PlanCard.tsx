import React from "react";
import { useTranslations } from "next-intl";
import { BackgroundGradient } from "./ui/background-gradient";
import Benefit from "./smallComponents/Benefit";
import { Link } from "@/i18n/routing";

const PlanCard = () => {
  const t = useTranslations("HomePage.proPlanCard");

  return (
    <BackgroundGradient className="relative overflow-hidden rounded-xl p-8 shadow-lg">
      {/* Floating Label */}
      <div className="absolute top-3 right-3 rounded-full bg-green-700 px-3 py-1 text-xs font-medium text-white">
        Best Value
      </div>

      <h3 className="text-4xl font-bold text-green-400">{t("plan")}</h3>

      <div className="mt-4 flex items-baseline gap-2">
        <h4 className="text-5xl font-extrabold text-white">$65</h4>
        <p className="text-sm text-slate-300">{t("frequency")}</p>
      </div>
      <p className="text-sm text-slate-400">{t("billed")}</p>

      <ul className="mt-6 space-y-4">
        <Benefit benefit={t("benefit1")} />
        <Benefit benefit={t("benefit2")} />
        <Benefit benefit={t("benefit3")} />
        <Benefit benefit={t("benefit4")} />
        <Benefit benefit={t("benefit5")} />
      </ul>

      <Link href={"/signup"}>
        <button className="mt-6 w-full rounded-lg bg-gradient-to-r from-green-600 to-green-800 px-6 py-3 text-lg font-medium text-white shadow-md transition hover:scale-105">
          {t("button")}
        </button>
      </Link>
    </BackgroundGradient>
  );
};

export default PlanCard;
