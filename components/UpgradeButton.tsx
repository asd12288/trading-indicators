import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpgradeButtonProps {
  profile: any;
  variant?: "default" | "mobile" | "sidebar";
  className?: string;
}

const UpgradeButton = ({
  profile,
  variant = "default",
  className,
}: UpgradeButtonProps) => {
  const t = useTranslations("Navbar.button");

  if (!profile || !profile.plan) {
    return null;
  }

  if (profile.plan !== "free") {
    return null;
  }

  // Different styles based on where the button is used
  const styles = {
    default:
      "flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:from-green-500 hover:to-green-600 hover:shadow-lg",
    mobile:
      "flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-2.5 text-sm font-medium text-white shadow-md",
    sidebar:
      "flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 px-3 py-2 text-sm font-medium text-white",
  };

  return (
    <Link
      href="/profile?tab=upgrade"
      className={cn(variant === "mobile" ? "block w-full" : "", className)}
    >
      <motion.button
        className={cn(styles[variant], className)}
        whileHover={
          variant !== "mobile"
            ? {
                scale: 1.03,
                boxShadow: "0 0 10px rgba(74, 222, 128, 0.3)",
              }
            : undefined
        }
        whileTap={{ scale: 0.97 }}
      >
        <Sparkles size={variant === "mobile" ? 16 : 14} />
        {t("title")}
      </motion.button>
    </Link>
  );
};

export default UpgradeButton;
