"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-slate-800 group-[.toaster]:text-white group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-brand-700 dark:group-[.toaster]:text-white group-[.toaster]:border-l-4",
          success:
            "group-[.toaster]:border-l-green-500 dark:group-[.toaster]:border-l-green-400",
          error:
            "group-[.toaster]:border-l-red-500 dark:group-[.toaster]:border-l-red-400",
          warning:
            "group-[.toaster]:border-l-amber-500 dark:group-[.toaster]:border-l-amber-400",
          info: "group-[.toaster]:border-l-blue-500 dark:group-[.toaster]:border-l-blue-400",
          description:
            "group-[.toast]:text-slate-200 dark:group-[.toast]:text-slate-200 group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-slate-700 group-[.toast]:text-slate-100 dark:group-[.toast]:bg-slate-600 dark:group-[.toast]:text-white group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:rounded-md group-[.toast]:transition-colors group-[.toast]:hover:bg-slate-600",
          cancelButton:
            "group-[.toast]:bg-neutral-100 group-[.toast]:text-neutral-500 dark:group-[.toast]:bg-neutral-800 dark:group-[.toast]:text-neutral-400",
          title:
            "group-[.toast]:font-semibold group-[.toast]:text-base group-[.toast]:mb-1",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
