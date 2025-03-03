import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import React from "react";

const UpgradeButton = ({ profile }) => {
  const t = useTranslations("Navbar.button");

  if (!profile || !profile.plan) {
    return null;
  }

  return (
    <>
      {profile.plan === "free" ? (
        <li>
          <Link href="/profile?tab=upgrade" className="hover:text-slate-300">
            <button className="rounded-lg bg-green-700 px-4 py-2 hover:bg-green-800">
              {t("title")}
            </button>
          </Link>
        </li>
      ) : null}
    </>
  );
};

export default UpgradeButton;
