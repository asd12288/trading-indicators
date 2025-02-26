"use client";

import useProfile from "@/hooks/useProfile";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBell, FaCircleUser, FaLock, FaRegMoneyBill1 } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import ManageAccount from "./ManageAccount";
import ProfileCard from "./ProfileCard";
import ResetPasswordForm from "./ResetPasswordForm";
import TelegramAuth from "./TelegramAuth";
import UpgradeAccount from "./UpgradeAccount";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const UserDashboard = ({ user }) => {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<string>("profile");
  const router = useRouter();
  const t = useTranslations("UserDashboard");

  const { profile, isLoading } = useProfile(user?.id);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    router.refresh();
  };

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  const isPro = profile?.plan === "pro";

  return (
    <>
      <h2 className="mb-4 text-2xl font-semibold md:text-4xl">{t("title")}</h2>
      <div className="mb-4 flex w-full flex-col rounded-md bg-slate-800 md:h-[600px] md:w-[1200px] md:flex-row">
        <aside className="flex w-full flex-col justify-center border-b border-slate-700 p-6 md:w-64 md:border-b-0 md:border-r md:p-12 md:pl-6">
          <nav className="w-full">
            <ul className="w-full justify-center md:gap-4 md:space-y-6 md:text-lg">
              <li className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 md:justify-start">
                <FaCircleUser />
                <button onClick={() => handleTabChange("profile")}>
                  {t("tabs.profile")}
                </button>
              </li>
              <li className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 md:justify-start">
                <FaLock />
                <button onClick={() => handleTabChange("password")}>
                  {t("tabs.password")}
                </button>
              </li>

              {isPro ? (
                <>
                  <li className="flex items-center justify-center gap-2 rounded-lg px-4 py-2">
                    <FaRegMoneyBill1 />
                    <button onClick={() => handleTabChange("manage")}>
                      {t("tabs.subscription")}
                    </button>
                  </li>
                  <li className="flex items-center justify-center gap-2 rounded-lg px-4 py-2">
                    <FaBell />
                    <button onClick={() => handleTabChange("notification")}>
                      {t("tabs.notification")}
                    </button>
                  </li>
                </>
              ) : (
                <li className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 md:justify-start">
                  <FaRegMoneyBill1 />
                  <button onClick={() => handleTabChange("upgrade")}>
                    {t("tabs.upgrade")}
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </aside>

        <main className="flex w-full flex-col items-center justify-center gap-4 p-6 md:p-12">
          <div className="flex flex-col items-center">
            {tab === "profile" && <ProfileCard user={user} profile={profile} />}
            {tab === "upgrade" && <UpgradeAccount user={user} />}
            {tab === "password" && <ResetPasswordForm />}
            {tab === "manage" && <ManageAccount profile={profile} />}
            {tab === "notification" && (
              <TelegramAuth profile={profile} userId={user?.id} />
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default UserDashboard;
