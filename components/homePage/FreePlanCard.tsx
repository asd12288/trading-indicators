import React from "react";
import Benefit from "../smallComponents/Benefit";
import Link from "next/link";
import { useTranslations } from "next-intl";

const FreePlanCard = () => {
  const t = useTranslations("HomePage.freePlanCard");

  return (
    <div className="space-y-8 rounded-lg bg-slate-900 p-8">
      <h3 className="text-3xl font-medium md:text-4xl">{t("plan")}</h3>

      <ul className="space-y-4 text-sm md:text-lg">
        <Benefit benefit={t("benefit1")} />
        <Benefit benefit={t("benefit2")} />
        <Benefit benefit={t("benefit3")} />
      </ul>
      <Link href={"/signup"}>
        <button className="mt-6 w-full rounded-lg bg-green-800 px-2 py-2 hover:bg-green-900">
          {t("button")}
        </button>
      </Link>
    </div>
  );
};

export default FreePlanCard;
