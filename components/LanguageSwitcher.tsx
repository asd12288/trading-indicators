"use client";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { routing } from "@/i18n/routing";

// Language configuration with additional details
const languages = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
  },
  {
    code: "sp",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    flag: "🇷🇺",
  },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];
  const router = useRouter();

  // Get available locales from the routing configuration
  const availableLocales = routing.locales;

  // Get the pathname without the locale prefix to prevent stacking
  const pathnameWithoutLocale = pathname.replace(
    new RegExp(`^/(${availableLocales.join("|")})(/|$)`),
    "/",
  );

  // Handle clicking outside dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Save language preference to localStorage
  useEffect(() => {
    if (locale) {
      localStorage.setItem("preferredLanguage", locale);
    }
  }, [locale]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown" && isOpen) {
      e.preventDefault();
      const focusableElements = document.querySelectorAll('[role="menuitem"]');
      (focusableElements[0] as HTMLElement).focus();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 rounded-md bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700"
      >
        <span className="mr-1">{currentLanguage.flag}</span>
        <span>{currentLanguage.name}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-menu"
          >
            <div className="py-1" role="none">
              {languages.map((language) => (
                <Link
                  key={language.code}
                  href={pathnameWithoutLocale || "/"}
                  locale={language.code}
                  onClick={() => {
                    setIsOpen(false);
                    window.location.assign(
                      `/${language.code}${pathnameWithoutLocale}`,
                    );
                  }}
                  className={`flex items-center px-4 py-3 text-sm transition-colors ${
                    locale === language.code
                      ? "bg-slate-700 text-white"
                      : "text-slate-200 hover:bg-slate-700/70"
                  }`}
                  role="menuitem"
                  tabIndex={0}
                >
                  <span className="mr-3 text-lg">{language.flag}</span>
                  <div className="flex flex-col">
                    <span>{language.name}</span>
                    <span className="text-xs text-slate-400">
                      {language.nativeName}
                    </span>
                  </div>
                  {locale === language.code && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-blue-400"></span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
