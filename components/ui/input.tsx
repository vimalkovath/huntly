import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-[var(--color-text-muted)] outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-[var(--color-text-muted)] outline-none transition focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
