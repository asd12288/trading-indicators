import { Link } from "@/i18n/routing";
import React from "react";

const UpgradeButton = ({ profile }) => {
  if (!profile || !profile.plan) {
    return null;
  }

  return (
    <>
      {profile.plan === "free" ? (
        <li>
          <Link href="/profile?tab=upgrade" className="hover:text-slate-300">
            <button className="rounded-lg bg-green-700 px-4 py-2 hover:bg-green-800">
              Upgrade to Pro
            </button>
          </Link>
        </li>
      ) : null}
    </>
  );
};

export default UpgradeButton;
