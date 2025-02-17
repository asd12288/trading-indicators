"use client";
import { User2Icon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsBookmarkStar } from "react-icons/bs";
import { GoGraph } from "react-icons/go";
import { RiLockPasswordLine } from "react-icons/ri";
import ProfileCard from "./ProfileCard";
import ResetPasswordForm from "./ResetPasswordForm";
import UpgradeAccount from "./UpgradeAccount";
import UserSignals from "./UserSignals";
import ManageAccount from "./ManageAccount";
import useProfile from "@/hooks/useProfile";
import TelegramAuth from "./TelegramAuth";

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
    router.refresh();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  const isPro = profile?.plan === "pro";

  return (
    <div className="flex h-[600px] w-[1200px] rounded-md bg-slate-800">
      <div>
        <aside className="h-full w-64 border-r border-slate-700 p-12 pl-6">
          <nav>
            <ul className="space-y-6 text-lg">
              <li className="flex items-center gap-2 rounded-lg px-4 py-2">
                <User2Icon />
                <button onClick={() => handleTabChange("profile")}>
                  My Profile
                </button>
              </li>
              <li className="flex items-center gap-2 rounded-lg px-4 py-2">
                <RiLockPasswordLine className="text-2xl" />

                <button onClick={() => handleTabChange("password")}>
                  Password{" "}
                </button>
              </li>

              {isPro ? (
                <li className="flex items-center gap-2 rounded-lg px-4 py-2">
                  <BsBookmarkStar />
                  <button onClick={() => handleTabChange("manage")}>
                    Subscription
                  </button>
                </li>
              ) : (
                <li className="flex items-center gap-2 rounded-lg px-4 py-2">
                  <BsBookmarkStar />
                  <button onClick={() => handleTabChange("upgrade")}>
                    Pro Account{" "}
                  </button>
                </li>
              )}

              <li className="flex items-center gap-2 rounded-lg px-4 py-2">
                <GoGraph />

                <button onClick={() => handleTabChange("my-signals")}>
                  My Signals
                </button>
              </li>
            </ul>
          </nav>
        </aside>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-4 p-12">
        <div className="flex flex-col items-center">
        <TelegramAuth userId={user?.id} />
          {tab === "profile" && <ProfileCard user={user} profile={profile} />}
          {tab === "upgrade" && <UpgradeAccount />}
          {tab === "password" && <ResetPasswordForm />}
          {tab === "manage" && <ManageAccount profile={profile} />}
          {tab === "my-signals" && (
            <UserSignals user={user} profile={profile} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
