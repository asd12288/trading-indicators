"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

// Create a default context value to avoid the need for null checks
const defaultContextValue: ThemeContextType = {
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Load theme preference from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle(
        "light-mode",
        savedTheme === "dark",
      );
    }
  }, []);

  // Update localStorage and document class when theme changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", theme);
      document.documentElement.classList.toggle("light-mode", theme === "dark");
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "dark" : "dark"));
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}
