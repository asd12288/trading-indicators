"use client";
import useProfile from "@/hooks/useProfile";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBell, FaCircleUser, FaLock, FaRegMoneyBill1 } from "react-icons/fa6";
import ManageAccount from "./ManageAccount";
import ProfileCard from "./ProfileCard";
import ResetPasswordForm from "./ResetPasswordForm";
import TelegramAuth from "./TelegramAuth";
import UpgradeAccount from "./UpgradeAccount";

const UserDashboard = ({ user }) => {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<string>("profile");
  const router = useRouter();

  const { profile, isLoading } = useProfile(user?.id);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    // If you want the querystring to change so users can share the URL:
    // router.push(`?tab=${newTab}`);
    // Or if you just want a refresh on the same page:
    router.refresh();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isPro = profile?.plan === "pro";

  return (
    /**
     * 1) Container uses flex-col on mobile, flex-row on md+,
     *    removing the fixed width/height so it flows freely on smaller screens.
     * 2) "mx-auto" centers the dashboard; you can add "max-w-screen-lg"
     *    or something similar if you want to limit the max width.
     */
    <div className="mx-auto flex flex-col rounded-md bg-slate-800 md:h-[600px] md:w-[1200px] md:flex-row">
      {/* Sidebar / Aside */}
      <aside className="flex w-full flex-col justify-center border-b border-slate-700 p-6 md:w-64 md:border-b-0 md:border-r md:p-12 md:pl-6">
        <nav>
          <ul className="justify-center md:gap-4 md:space-y-6 md:text-lg">
            <li className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 md:justify-start">
              <FaCircleUser />
              <button onClick={() => handleTabChange("profile")}>
                My Profile
              </button>
            </li>
            <li className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 md:justify-start">
              <FaLock />
              <button onClick={() => handleTabChange("password")}>
                Password
              </button>
            </li>

            {isPro ? (
              <>
                <li className="flex items-center justify-center gap-2 rounded-lg px-4 py-2">
                  <FaRegMoneyBill1 />
                  <button onClick={() => handleTabChange("manage")}>
                    Subscription
                  </button>
                </li>
                <li className="flex items-center justify-center gap-2 rounded-lg px-4 py-2">
                  <FaBell />
                  <button onClick={() => handleTabChange("notification")}>
                    Notification
                  </button>
                </li>
              </>
            ) : (
              <li className="flex items-center justify-center gap-2 rounded-lg px-4 py-2 md:justify-start">
                <FaRegMoneyBill1 />
                <button onClick={() => handleTabChange("upgrade")}>
                  Upgrade
                </button>
              </li>
            )}
            {/* Example of another link (commented out)
            <li className="flex items-center gap-2 rounded-lg px-4 py-2">
              <GoGraph />
              <button onClick={() => handleTabChange("my-signals")}>
                My Signals
              </button>
            </li> 
            */}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex w-full flex-col items-center justify-center gap-4 p-6 md:p-12">
        <div className="flex flex-col items-center">
          {tab === "profile" && <ProfileCard user={user} profile={profile} />}
          {tab === "upgrade" && <UpgradeAccount />}
          {tab === "password" && <ResetPasswordForm />}
          {tab === "manage" && <ManageAccount profile={profile} />}
          {tab === "notification" && (
            <TelegramAuth profile={profile} userId={user?.id} />
          )}
          {/* {tab === "my-signals" && (
            <UserSignals user={user} profile={profile} />
          )} */}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
