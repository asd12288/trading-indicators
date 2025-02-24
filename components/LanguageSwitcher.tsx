"use client";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const languages = {
    en: "English",
    fr: "Français",
    de: "Deutsch",
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-sm hover:bg-slate-700"
      >
        {languages[locale]}
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-32 rounded-md bg-slate-800 py-1 shadow-lg">
          {Object.entries(languages).map(([code, name]) => (
            <Link
              key={code}
              href={pathname}
              locale={code}
              className={`block px-4 py-2 text-sm ${
                locale === code
                  ? "bg-slate-700 text-white"
                  : "hover:bg-slate-700"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}