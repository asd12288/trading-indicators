import React from "react";
import { Button } from "../ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const Cta = () => {
  const t = useTranslations("HomePage.cta");

  return (
    <div className="my-4 bg-gradient-to-t from-slate-800 to-slate-700 p-12 text-center">
      <h4 className="text-4xl font-semibold">{t("title")}</h4>
      <h5 className="mt-2 text-xl">{t("subtitle")} </h5>
      <Link href="/signup">
        <Button className="mt-4 px-6 py-3">{t("button")}</Button>
      </Link>
    </div>
  );
};

export default Cta;
