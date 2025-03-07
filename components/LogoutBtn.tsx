"use client";

import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { logout } from "@/app/[locale]/(auth)/login/actions";

interface LogoutBtnProps {
  locale: string;
  fullWidth?: boolean;
}

export default function LogoutBtn({
  locale,
  fullWidth = false,
}: LogoutBtnProps) {
  const t = useTranslations("Navbar.links");
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("locale", locale);
      await logout(formData);
    });
  };

  return (
    <form action={handleLogout}>
      <input type="hidden" name="locale" value={locale} />

      {fullWidth ? (
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          whileHover={{ boxShadow: "0 0 8px rgba(74, 222, 128, 0.3)" }}
          className="flex w-full items-center justify-center gap-2.5 rounded-md bg-gradient-to-r from-slate-700 to-slate-800 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-slate-600 hover:to-slate-700 hover:shadow-lg disabled:opacity-70"
          disabled={isPending}
        >
          <LogOut size={16} className="shrink-0" />
          <span>{t("logout")}</span>
          {isPending && (
            <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-transparent"></span>
          )}
        </motion.button>
      ) : (
        <motion.button
          type="submit"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 rounded px-2.5 py-1 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800/40 hover:text-white disabled:opacity-70"
          disabled={isPending}
        >
          <span>{t("logout")}</span>
          {isPending && (
            <span className="ml-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-transparent"></span>
          )}
        </motion.button>
      )}
    </form>
  );
}
