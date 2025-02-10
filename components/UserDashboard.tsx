"use client";
import { User2Icon } from "lucide-react";
import React, { useState } from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import { GoGraph } from "react-icons/go";
import PlanCard from "./homePage/PlanCard";
import UpgradeAccount from "./UpgradeAccount";
import ProfileCard from "./ProfileCard";
import UserSignals from "./UserSignals";

const UserDashboard = ({ user, profile }) => {
  const [tab, setTab] = useState<string>("my-signals");

  // check if the user is already pro
  // if (user?.subscription?.status === "active") {
  //   const proUser = true;
  // }

  return (
    <div className="flex h-[600px] w-[1200px] rounded-md bg-slate-800">
      <div>
        <aside className="h-full w-64 border-r border-slate-700 p-12 pl-6">
          <nav>
            <ul className="space-y-6 text-lg">
              <li className="flex items-center gap-2">
                <User2Icon />
                <button onClick={() => setTab("profile")}>My Profile</button>
              </li>
              <li className="flex items-center gap-2">
                <button onClick={() => setTab("upgrade")}>
                  Upgrade to pro
                </button>
              </li>
              <li className="flex items-center gap-2">
                <GoGraph />

                <button onClick={() => setTab("my-signals")}>My Signals</button>
              </li>
            </ul>
          </nav>
        </aside>
      </div>

      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          {tab === "profile" && <ProfileCard user={user} />}
          {tab === "upgrade" && <UpgradeAccount />}
          {tab === "my-signals" && (
            <UserSignals user={user} profile={profile} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
