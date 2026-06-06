"use client";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect } from "react";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-lg shadow-2xl",
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
            <h3 className="text-lg font-display font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-[var(--muted-foreground)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
