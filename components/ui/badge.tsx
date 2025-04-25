import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-slate-700 text-slate-50 ",
        primary: "bg-blue-600 text-primary-foreground hover:bg-blue-700",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-red-600 text-destructive-foreground hover:bg-red-700",
        outline: "border border-slate-700 text-slate-50",
        success: "bg-green-600 text-green-50 hover:bg-green-700",
        warning: "bg-amber-600 text-amber-50 hover:bg-amber-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
