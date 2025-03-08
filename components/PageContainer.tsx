import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export default function PageContainer({
  children,
  className,
  maxWidth = "full",
}: PageContainerProps) {
  const maxWidthClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-7xl",
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <main className="px-4 py-8">
        <div className={cn("mx-auto", maxWidthClasses[maxWidth], className)}>
          {children}
        </div>
      </main>
    </div>
  );
}
