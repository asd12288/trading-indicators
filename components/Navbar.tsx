"use client";
import { Link } from "@/i18n/routing";
import {
  MapIcon,
  User,
  LogOut,
  Lightbulb,
  LineChart,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState, MouseEvent } from "react";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import LogoutBtn from "./LogoutBtn";
import UpgradeButton from "./UpgradeButton";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "@/components/NotificationBell";
import { useAuth } from "@/context/auth-context";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  role?: string;
  plan?: "free" | "pro" | "premium";
  username?: string;
  email?: string;
  created_at?: string;
  avatar_url?: string;
  preferences?: Record<string, unknown>;
}

interface NavbarProps {
  serverUser: SupabaseUser | null;
  serverProfile: UserProfile | null;
}

export default function Navbar({ serverUser, serverProfile }: NavbarProps) {
  const { user } = useAuth();
  // Use server data initially, then client data once available
  const currentUser = user || serverUser;
  const currentProfile = serverProfile; // Profile is only needed from server

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();
  const t = useTranslations("Navbar.links");

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      if (isMobileOpen) setIsMobileOpen(false);
    };

    // Close mobile menu when route changes
    if (isMobileOpen) setIsMobileOpen(false);

    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [pathname, isMobileOpen]);

  // Prevent clicks inside the menu from closing it
  const handleMenuClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  // Check if a link is active
  const isActive = (path: string) => {
    return pathname.startsWith(`/${locale}${path}`);
  };

  return (
    <header className="relative w-full">
      {/* Desktop Menu */}
      <div className="hidden lg:block">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <MapIcon height={30} width={30} className="text-blue-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Trader<span className="text-blue-400">Map</span>
            </h1>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/smart-alerts"
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium ${
                isActive("/smart-alerts")
                  ? "bg-slate-800 text-blue-400"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <LineChart size={18} />
              {t("signals")}
            </Link>

            <Link
              href="/blogs"
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium ${
                isActive("/blogs")
                  ? "bg-slate-800 text-blue-400"
                  : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <Lightbulb size={18} />
              {t("blog")}
            </Link>

            <div className="ml-2 flex items-center gap-2">
              <LanguageSwitcher />

              <div className="mx-3 h-5 w-px bg-slate-700/50"></div>

              <NotificationBell />

              {currentUser ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/profile"
                    className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium ${
                      isActive("/profile")
                        ? "bg-slate-800 text-blue-400"
                        : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                    }`}
                  >
                    <User size={18} />
                    <span>{t("profile")}</span>
                  </Link>

                  <UpgradeButton profile={currentProfile} variant="default" />

                  <div className="group flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white">
                    <LogOut size={18} />
                    <LogoutBtn locale={locale} />
                  </div>
                </div>
              ) : (
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    {t("login")}
                  </motion.button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex h-16 items-center justify-between px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <MapIcon height={24} width={24} className="text-blue-400" />
          <h1 className="text-xl font-bold tracking-tight text-white">
            Trader<span className="text-blue-400">Map</span>
          </h1>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <NotificationBell />

          {/* Mobile Menu Button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-800 text-slate-200 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileOpen(!isMobileOpen);
            }}
          >
            {isMobileOpen ? (
              <RxCross1 className="text-xl" />
            ) : (
              <RxHamburgerMenu className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Animated slide-down */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden lg:hidden"
            onClick={handleMenuClick}
          >
            <nav className="mx-4 mb-4 space-y-1 rounded-lg bg-slate-800 p-2 shadow-lg">
              <Link
                href="/smart-alerts"
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center justify-between rounded-md px-3 py-2.5 ${
                  isActive("/smart-alerts")
                    ? "bg-slate-700 text-blue-400"
                    : "text-slate-200 hover:bg-slate-700/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <LineChart size={18} />
                  <span className="font-medium">{t("signals")}</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
              </Link>

              <Link
                href="/blogs"
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center justify-between rounded-md px-3 py-2.5 ${
                  isActive("/blogs")
                    ? "bg-slate-700 text-blue-400"
                    : "text-slate-200 hover:bg-slate-700/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Lightbulb size={18} />
                  <span className="font-medium">{t("blog")}</span>
                </div>
                <ChevronRight size={16} className="opacity-50" />
              </Link>

              {currentProfile?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center justify-between rounded-md px-3 py-2.5 ${
                    isActive("/admin")
                      ? "bg-slate-700 text-blue-400"
                      : "text-slate-200 hover:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">Admin</span>
                  </div>
                  <ChevronRight size={16} className="opacity-50" />
                </Link>
              )}

              <div className="my-1.5 h-px w-full bg-slate-700/50" />

              {currentUser ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center justify-between rounded-md px-3 py-2.5 ${
                      isActive("/profile")
                        ? "bg-slate-700 text-blue-400"
                        : "text-slate-200 hover:bg-slate-700/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <User size={18} />
                      <span className="font-medium">{t("profile")}</span>
                    </div>
                    <ChevronRight size={16} className="opacity-50" />
                  </Link>

                  {/* Updated UpgradeButton for mobile */}
                  <div className="mt-3 px-1">
                    <UpgradeButton profile={currentProfile} variant="mobile" />
                  </div>

                  <div className="px-3 py-2">
                    <LogoutBtn locale={locale} fullWidth />
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="block w-full"
                >
                  <button className="mt-1 w-full rounded-md bg-blue-600 px-4 py-2.5 text-center font-medium text-white hover:bg-blue-700">
                    {t("login")}
                  </button>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
