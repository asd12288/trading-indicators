import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
  children: React.ReactNode;
  className?: string;
}

interface BreadcrumbItemProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

interface BreadcrumbSeparatorProps {
  children?: React.ReactNode;
  className?: string;
}

const BreadcrumbContext = React.createContext<{ theme: "dark" | "light" }>({
  theme: "dark",
});

const BreadcrumbItem = ({
  children,
  className,
  isActive = false,
}: BreadcrumbItemProps) => {
  const { theme } = React.useContext(BreadcrumbContext);

  return (
    <li
      className={cn(
        "inline-flex items-center",
        isActive
          ? theme === "dark"
            ? "text-slate-100"
            : "text-slate-800"
          : theme === "dark"
            ? "text-slate-400"
            : "text-slate-500",
        className,
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </li>
  );
};

const BreadcrumbSeparator = ({
  children,
  className,
}: BreadcrumbSeparatorProps) => {
  const { theme } = React.useContext(BreadcrumbContext);

  return (
    <li
      className={cn(
        "mx-2 inline-flex items-center",
        theme === "dark" ? "text-slate-500" : "text-slate-400",
        className,
      )}
      aria-hidden="true"
    >
      {children || <ChevronRight className="h-4 w-4" />}
    </li>
  );
};

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ children, className, ...props }, ref) => {
    const theme = "dark";

    return (
      <BreadcrumbContext.Provider value={{ theme }}>
        <nav ref={ref} aria-label="Breadcrumb" className={className} {...props}>
          <ol className="flex flex-wrap items-center text-sm">{children}</ol>
        </nav>
      </BreadcrumbContext.Provider>
    );
  },
);

Breadcrumb.displayName = "Breadcrumb";

// Attach the Item and Separator as properties to the Breadcrumb component
Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.Separator = BreadcrumbSeparator;
