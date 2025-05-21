"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ThemeToggle({ className }: { className?: string }) {
  // Add state to track if component is mounted
  const [mounted, setMounted] = useState(false);
  const theme = "dark";
  const toggleTheme = () => {};

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // If not mounted yet, render a placeholder to avoid hydration errors
  if (!mounted) {
    return (
      <button
        className={`relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-700/40 bg-slate-800/90 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-700 hover:text-white focus:outline-none ${className}`}
        aria-label="Loading theme toggle"
      ></button>
    );
  }

  // Now it's safe to use the hook because we're on the client

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-700/40 bg-slate-800/90 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-700 hover:text-white focus:outline-none ${className}`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <motion.div
        initial={{ opacity: 0, rotate: -20 }}
        animate={{ opacity: 1, rotate: 0 }}
        exit={{ opacity: 0, rotate: 20 }}
        key={theme}
        transition={{ duration: 0.3 }}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </motion.div>
    </button>
  );
}
