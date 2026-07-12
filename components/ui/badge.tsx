import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      tone: {
        neutral: "border-white/10 bg-white/5 text-[var(--color-text-secondary)]",
        violet: "border-violet-400/30 bg-violet-400/10 text-violet-300",
        cyan: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
        amber: "border-amber-400/30 bg-amber-400/10 text-amber-300",
        emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
        rose: "border-rose-400/30 bg-rose-400/10 text-rose-300",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
