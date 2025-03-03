"use client";
import { Link } from "@/i18n/routing";
import { MapIcon } from "lucide-react";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import LogoutBtn from "./LogoutBtn";
import UpgradeButton from "./UpgradeButton";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function Navbar({ user, profile }) {
  // State to handle mobile menu toggle
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { locale } = useParams<{ locale: string }>();

  const t = useTranslations("Navbar.links");

  return (
    <header className="relative top-0 z-50 mx-auto w-full">
      {/* Desktop Menu */}
      <div className="hidden lg:block">
        <ul className="flex items-center justify-between p-8 text-lg font-medium">
          <li>
            <Link href="/">
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-semibold">Trader Map</h1>
                <MapIcon height={35} width={35} />
              </div>
            </Link>
          </li>

          <div className="flex items-center gap-12">
            <li>
              <LanguageSwitcher />
            </li>
            <li className="hover:text-slate-300">
              <Link
                href="/smart-alerts"
                className="flex items-center gap-2 hover:text-slate-300"
              >
                <p> {t("signals")}</p>
              </Link>
            </li>

            <li className="hover:text-slate-300">
              <Link
                href="/docs/getting-started"
                className="flex items-center gap-2 hover:text-slate-300"
              >
                <p>Docs</p>
              </Link>
            </li>

            <li>
              <Link href="/blogs" className="hover:text-slate-300">
                {t("blog")}
              </Link>
            </li>

            {profile?.role === "admin" && (
              <li>
                <Link href="/admin" className="hover:text-slate-300">
                  Admin
                </Link>
              </li>
            )}

            {user ? (
              <>
                <li>
                  <Link href="/profile" className="hover:text-slate-300">
                    {t("profile")}
                  </Link>
                </li>
                <UpgradeButton profile={profile} />
                <li>
                  <LogoutBtn locale={locale} />
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className="hover:text-slate-300">
                  <button className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-900">
                    {t("login")}
                  </button>
                </Link>
              </li>
            )}
          </div>
        </ul>
      </div>

      {/* Mobile Menu */}
      <div className="flex items-center justify-between p-4 lg:hidden">
        <Link href="/">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">Trader Map</h1>
            <MapIcon height={25} width={25} />
          </div>{" "}
        </Link>

        {/* Hamburger Button */}
        <button
          className="text-slate-200 focus:outline-none"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {/* Simple "hamburger" icon using 3 bars */}
          <RxHamburgerMenu className="text-3xl" />
        </button>
      </div>

      {/* Slide-down mobile menu */}
      {isMobileOpen && (
        <ul className="transtion mb-3 flex flex-col items-center gap-4 bg-slate-900 px-6 py-4 text-sm ease-in lg:hidden">
          <li>
            <Link
              href="/smart-alerts"
              className="block w-full hover:text-slate-300"
              onClick={() => setIsMobileOpen(false)}
            >
              {t("signals")}
            </Link>
          </li>
          <li>
            <Link
              href="/blogs"
              className="block w-full hover:text-slate-300"
              onClick={() => setIsMobileOpen(false)}
            >
              {t("blog")}
            </Link>
          </li>
          <li>
            <Link
              href="/docs/getting-started"
              className="block w-full hover:text-slate-300"
              onClick={() => setIsMobileOpen(false)}
            >
              Docs
            </Link>
          </li>
          {profile?.role === "admin" && (
            <li>
              <Link
                href="/admin"
                className="block w-full hover:text-slate-300"
                onClick={() => setIsMobileOpen(false)}
              >
                Admin
              </Link>
            </li>
          )}

          {user ? (
            <>
              <li>
                <Link
                  href="/profile"
                  className="block w-full hover:text-slate-300"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {t("profile")}
                </Link>
              </li>

              <li>
                <LogoutBtn locale={locale} />
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/login"
                className="block w-full hover:text-slate-300"
                onClick={() => setIsMobileOpen(false)}
              >
                <button className="mt-1 w-full rounded-lg bg-slate-800 px-4 py-2 text-left hover:bg-slate-900">
                  {t("login")}
                </button>
              </Link>
            </li>
          )}
        </ul>
      )}
    </header>
  );
}
