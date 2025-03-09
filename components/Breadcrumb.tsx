import React from "react";

interface BreadcrumbProps {
  children: React.ReactNode;
  className?: string;
}

const Breadcrumb = ({ children, className = "" }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-sm ${className}`}>
      <ol className="flex items-center space-x-2">{children}</ol>
    </nav>
  );
};

const BreadcrumbItem = ({ children }: { children: React.ReactNode }) => {
  return <li className="text-slate-700">{children}</li>;
};

const BreadcrumbSeparator = ({ children }: { children: React.ReactNode }) => {
  return <li className="text-slate-400">{children}</li>;
};

Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.Separator = BreadcrumbSeparator;

export default Breadcrumb;
