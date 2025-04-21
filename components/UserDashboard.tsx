"use client";

import { useEffect, useState, useRef } from "react";
import { FaBell, FaCircleUser, FaLock, FaRegMoneyBill1 } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import ManageAccount from "./ManageAccount";
import ProfileCard from "./ProfileCard";
import ResetPasswordForm from "./ResetPasswordForm";
import TelegramAuth from "./TelegramAuth";
import UpgradeAccount from "./UpgradeAccount";
import ProfileLoader from "./loaders/ProfileLoader";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import NotificationPreferencesManager from "./NotificationPreferencesManager";
import NotificationExample from "./NotificationExample";
import supabaseClient from "@/database/supabase/supabase.js";

const UserDashboard = ({ user }) => {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<string>("profile");
  const router = useRouter();
  const t = useTranslations("UserDashboard");
  const mainRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<string>("auto");
  
  // Handle profile loading directly since we get user from props
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch profile based on the provided user ID
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const { data, error } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  useEffect(() => {
    // Handle tab from URL without causing page jumps
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setTab(tabParam);
    }
  }, [searchParams]);

  // Update URL without causing a page jump
  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    // Update URL without causing page refresh
    window.history.replaceState(
      null,
      "",
      window.location.pathname + "?tab=" + newTab,
    );
  };

  // Measure available height for content area to prevent layout shifts
  useEffect(() => {
    const updateHeight = () => {
      if (mainRef.current && window.innerWidth >= 768) {
        // On desktop, set a fixed height
        setContentHeight("550px");
      } else {
        // On mobile, use auto height
        setContentHeight("auto");
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  if (isLoading) {
    return <ProfileLoader />;
  }

  const isPro = profile?.plan === "pro";

  const TabItem = ({ id, icon: Icon, label }) => {
    const isActive = tab === id;
    return (
      <li
        onClick={() => handleTabChange(id)}
        className={cn(
          "flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 transition-all",
          isActive
            ? "bg-slate-700/60 text-slate-100 shadow-md"
            : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-300",
        )}
      >
        <Icon className={cn(isActive ? "text-blue-400" : "")} />
        <span>{label}</span>
        {isActive && (
          <motion.div
            className="ml-auto h-2 w-2 rounded-full bg-blue-500"
            layoutId="activeIndicator"
          />
        )}
      </li>
    );
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <h2 className="mb-6 text-2xl font-semibold text-slate-100 md:mb-8 md:text-4xl">
        {t("title")}
      </h2>
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900/60 shadow-lg backdrop-blur-sm">
        <div className="flex min-h-[650px] flex-col md:flex-row">
          <aside className="border-b border-slate-700 bg-slate-800/20 p-4 md:w-64 md:border-b-0 md:border-r">
            <nav className="w-full">
              <ul className="flex flex-row justify-around gap-2 md:flex-col md:gap-2 md:space-y-1">
                <TabItem
                  id="profile"
                  icon={FaCircleUser}
                  label={t("tabs.profile")}
                />
                <TabItem
                  id="password"
                  icon={FaLock}
                  label={t("tabs.password")}
                />

                {isPro ? (
                  <>
                    <TabItem
                      id="manage"
                      icon={FaRegMoneyBill1}
                      label={t("tabs.subscription")}
                    />
                    <TabItem
                      id="notification"
                      icon={FaBell}
                      label={t("tabs.notification")}
                    />
                  </>
                ) : (
                  <TabItem
                    id="upgrade"
                    icon={FaRegMoneyBill1}
                    label={t("tabs.upgrade")}
                  />
                )}
              </ul>
            </nav>
          </aside>

          <main
            ref={mainRef}
            className="flex flex-1 items-center justify-center overflow-y-auto p-4 md:p-8"
            style={{ height: contentHeight }}
          >
            <div className="flex w-full items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  {tab === "profile" && (
                    <ProfileCard user={user} profile={profile} />
                  )}
                  {tab === "upgrade" && <UpgradeAccount user={user} />}
                  {tab === "password" && <ResetPasswordForm />}
                  {tab === "manage" && <ManageAccount profile={profile} />}
                  {tab === "notification" && (
                    <div className="space-y-8">
                      <TelegramAuth profile={profile} userId={user?.id} />
                      <NotificationPreferencesManager />
                      <NotificationExample />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
