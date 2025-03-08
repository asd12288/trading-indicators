import { ReactNode } from "react";

interface PageTitleProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function PageTitle({
  title,
  description,
  actions,
}: PageTitleProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-slate-400">{description}</p>
        )}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
