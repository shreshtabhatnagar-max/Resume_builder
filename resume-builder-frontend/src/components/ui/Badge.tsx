import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "destructive";
  className?: string;
}) {
  const variants: Record<string, string> = {
    default: "bg-white/5 text-[#aaa] border-[var(--border)]",
    accent: "bg-[var(--accent-muted)] text-[var(--accent)] border-[var(--accent)]/20",
    success: "bg-green-500/10 text-green-400 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    destructive: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
