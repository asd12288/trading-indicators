"use client";
import { User2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsBookmarkStar } from "react-icons/bs";
import { GoGraph } from "react-icons/go";
import { RiLockPasswordLine } from "react-icons/ri";
import ProfileCard from "./ProfileCard";
import ResetPasswordForm from "./ResetPasswordForm";
import UpgradeAccount from "./UpgradeAccount";
import UserSignals from "./UserSignals";

const UserDashboard = ({ user, profile }) => {
  const [tab, setTab] = useState<string>("profile");
  const router = useRouter();

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    router.refresh();
  };

  return (
    <div className="flex h-[600px] w-[1200px] rounded-md bg-slate-800">
      <div>
        <aside className="h-full w-64 border-r border-slate-700 p-12 pl-6">
          <nav>
            <ul className="space-y-6 text-lg">
              <li className="flex items-center gap-2">
                <User2Icon />
                <button onClick={() => handleTabChange("profile")}>
                  My Profile
                </button>
              </li>
              <li className="flex items-center gap-2">
                <RiLockPasswordLine className="text-2xl" />

                <button onClick={() => handleTabChange("password")}>
                  Password{" "}
                </button>
              </li>
              <li className="flex items-center gap-2">
                <BsBookmarkStar />

                <button onClick={() => handleTabChange("upgrade")}>
                  Upgrade to pro
                </button>
              </li>
              <li className="flex items-center gap-2">
                <GoGraph />

                <button onClick={() => handleTabChange("my-signals")}>
                  My Signals
                </button>
              </li>
            </ul>
          </nav>
        </aside>
      </div>

      <div className="flex w-full flex-col items-center gap-4 p-12">
        <div className="flex flex-col items-center">
          {tab === "profile" && <ProfileCard user={user} profile={profile} />}
          {tab === "upgrade" && <UpgradeAccount />}
          {tab === "password" && <ResetPasswordForm />}
          {tab === "my-signals" && (
            <UserSignals user={user} profile={profile} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
