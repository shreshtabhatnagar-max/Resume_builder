"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getInitials } from "@/lib/utils";
import { LogOut, User, FileText, CreditCard, Crown } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <FileText className="w-4 h-4 text-[#080808]" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Resume<span className="text-[var(--accent)]">Forge</span>
          </span>
        </Link>

        {/* Nav links */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-1">
            <Link href="/dashboard" className="px-4 py-2 rounded-lg text-sm text-[#aaa] hover:text-[var(--foreground)] hover:bg-white/5 transition-all">
              Dashboard
            </Link>
            <Link href="/dashboard/templates" className="px-4 py-2 rounded-lg text-sm text-[#aaa] hover:text-[var(--foreground)] hover:bg-white/5 transition-all">
              Templates
            </Link>
            <Link href="/dashboard/upgrade" className="px-4 py-2 rounded-lg text-sm text-[#aaa] hover:text-[var(--foreground)] hover:bg-white/5 transition-all flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              Upgrade
            </Link>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-[var(--border)]"
              >
                <div className="w-7 h-7 rounded-lg bg-[var(--accent-muted)] text-[var(--accent)] flex items-center justify-center text-xs font-bold font-display">
                  {getInitials(user.name)}
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium leading-none">{user.name}</span>
                  {user.subscriptionPlan === "premium" && (
                    <Badge variant="accent" className="mt-0.5 text-[10px] py-0">Pro</Badge>
                  )}
                </div>
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl z-20 overflow-hidden">
                    <div className="p-3 border-b border-[var(--border)]">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)] truncate">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      <Link href="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors">
                        <User className="w-4 h-4 text-[var(--muted-foreground)]" />
                        Profile
                      </Link>
                      <Link href="/dashboard/payments" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors">
                        <CreditCard className="w-4 h-4 text-[var(--muted-foreground)]" />
                        Billing
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
