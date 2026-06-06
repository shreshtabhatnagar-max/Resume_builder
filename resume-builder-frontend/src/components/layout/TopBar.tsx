"use client";

import { usePathname } from "next/navigation";
import { Bell, Crown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/resumes": "My Resumes",
  "/dashboard/resumes/new": "New Resume",
  "/dashboard/templates": "Templates",
  "/dashboard/payments": "Billing & Plans",
  "/dashboard/profile": "Profile",
};

export default function TopBar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const title = Object.entries(titleMap)
    .filter(([key]) => pathname.startsWith(key))
    .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? "Dashboard";

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 flex-shrink-0 bg-card/50 backdrop-blur-sm">
      <h1
        className="text-lg font-semibold text-foreground"
        style={{ fontFamily: "Syne, sans-serif" }}
      >
        {title}
      </h1>

      <div className="flex items-center gap-3">
        {user?.subscriptionPlan === "premium" && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Crown className="w-3 h-3 text-amber-400" />
            <span className="text-xs font-medium text-amber-300">Premium</span>
          </div>
        )}

        <button className="relative w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>

        <Link href="/dashboard/profile">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary hover:bg-primary/30 transition-colors cursor-pointer">
            {user?.name?.slice(0, 2).toUpperCase() ?? "?"}
          </div>
        </Link>
      </div>
    </header>
  );
}
