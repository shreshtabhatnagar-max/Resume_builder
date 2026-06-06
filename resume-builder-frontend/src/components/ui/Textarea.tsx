"use client";
import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-[#aaa]">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]",
            "placeholder:text-[var(--muted-foreground)] rounded-[10px] px-4 py-2.5 text-sm",
            "focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all resize-none",
            error && "border-red-500/60",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
export { Textarea };
