"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoutBtn from "./LogoutBtn";
import UpgradeButton from "./UpgradeButton";
import { FaHamburger } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";

export default function Navbar({ user, profile }) {
  // State to handle mobile menu toggle
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header className="relative top-0 z-50 mx-auto w-full">
      {/* Desktop Menu */}
      <div className="hidden lg:block">
        <ul className="flex items-center justify-between p-8 text-lg font-medium">
          <li>
            <Link href="/">
              <Image src="/logo.png" alt="logo" width={200} height={100} />
            </Link>
          </li>

          <div className="flex items-center gap-12">
            <li className="hover:text-slate-300">
              <Link
                href="/signals"
                className="flex items-center gap-2 hover:text-slate-300"
              >
                <p>Signals</p>
              </Link>
            </li>

            <li>
              <Link href="/blog" className="hover:text-slate-300">
                Blog
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
                    Profile
                  </Link>
                </li>
                <UpgradeButton profile={profile} />
                <li>
                  <LogoutBtn />
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className="hover:text-slate-300">
                  <button className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-900">
                    Login
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
          <Image src="/logo.png" alt="logo" width={140} height={70} />
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
        <ul className="transtion flex flex-col mb-3 items-center gap-4 bg-slate-900 px-6 py-4 text-sm ease-in lg:hidden">
          <li>
            <Link
              href="/signals"
              className="block w-full hover:text-slate-300"
              onClick={() => setIsMobileOpen(false)}
            >
              Signals
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="block w-full hover:text-slate-300"
              onClick={() => setIsMobileOpen(false)}
            >
              Blog
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
                  Profile
                </Link>
              </li>

              <li>
                <LogoutBtn />
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
                  Login
                </button>
              </Link>
            </li>
          )}
        </ul>
      )}
    </header>
  );
}
