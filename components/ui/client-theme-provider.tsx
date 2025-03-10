
import { useTheme } from "@/context/theme-context";
import { ReactNode, useEffect, useState } from "react";

interface ClientThemeProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ClientThemeProvider({ children, fallback }: ClientThemeProviderProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // During SSR or before mounting, show fallback or children
  if (!mounted) {
    return <>{fallback || children}</>;
  }
  
  return <div data-theme={theme}>{children}</div>;
}

// Custom hook to use in client components that need theme
export function useClientTheme() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return {
    theme: mounted ? theme : "dark",
    isDark: mounted ? theme === "dark" : true,
    isLight: mounted ? theme === "light" : false,
    mounted
  };
}
