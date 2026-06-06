"use client";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "accent" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "accent", size = "md", loading, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none";
    const variants: Record<string, string> = {
      accent: "btn-accent",
      ghost: "btn-ghost",
      destructive:
        "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-[10px]",
      outline:
        "bg-transparent border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--card-hover)] rounded-[10px]",
    };
    const sizes: Record<string, string> = {
      sm: "px-3 py-1.5 text-sm rounded-lg",
      md: "px-5 py-2.5 text-sm",
      lg: "px-7 py-3.5 text-base",
      icon: "w-9 h-9 rounded-[10px]",
    };
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export { Button };
