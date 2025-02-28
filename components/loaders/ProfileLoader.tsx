import React from "react";
import { useTranslations } from "next-intl";

const ProfileLoader = () => {
  const t = useTranslations("UserDashboard");

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-semibold md:text-4xl animate-pulse">{t("title")}</h2>
      <div className="flex w-full animate-pulse flex-col rounded-md bg-slate-800 md:h-[600px] md:w-[1200px]"></div>
    </div>
  );
};

export default ProfileLoader;
