"use client";
import { useState, useRef } from "react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getInitials, formatDate } from "@/lib/utils";
import { Camera, User, Mail, Calendar, Crown, Shield } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await authService.uploadProfileImage(file);
      if (user) {
        const updated = { ...user, profileImageUrl: result.url };
        setUser(updated);
      }
      toast.success("Profile image updated!");
    } catch {
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-[var(--muted-foreground)]">Manage your account settings.</p>
      </div>

      {/* Profile card */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-[var(--accent-muted)] flex items-center justify-center overflow-hidden">
              {user.profileImageUrl ? (
                <img src={user.profileImageUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-display font-bold text-3xl text-[var(--accent)]">
                  {getInitials(user.name)}
                </span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center hover:bg-[var(--accent-hover)] transition-colors shadow-lg"
            >
              <Camera className="w-3.5 h-3.5 text-[#080808]" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h2 className="font-display text-2xl font-bold">{user.name}</h2>
              <Badge variant={user.subscriptionPlan === "premium" ? "accent" : "default"}>
                {user.subscriptionPlan === "premium" ? "Premium" : "Basic"}
              </Badge>
            </div>
            <p className="text-[var(--muted-foreground)] text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden mb-6">
        <div className="p-5 border-b border-[var(--border)]">
          <h3 className="font-display font-semibold">Account Details</h3>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {[
            { icon: <User className="w-4 h-4" />, label: "Full Name", value: user.name },
            { icon: <Mail className="w-4 h-4" />, label: "Email Address", value: user.email },
            { icon: <Crown className="w-4 h-4" />, label: "Subscription Plan", value: user.subscriptionPlan === "premium" ? "Premium (Lifetime)" : "Basic (Free)" },
            { icon: <Shield className="w-4 h-4" />, label: "Email Verified", value: user.emailVerified ? "Verified ✓" : "Not verified" },
            { icon: <Calendar className="w-4 h-4" />, label: "Member Since", value: user.createdAt ? formatDate(user.createdAt) : "—" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-4 p-5">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[var(--muted-foreground)] flex-shrink-0">
                {row.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs text-[var(--muted-foreground)]">{row.label}</p>
                <p className="text-sm font-medium mt-0.5">{row.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade CTA */}
      {user.subscriptionPlan !== "premium" && (
        <div className="bg-[var(--accent-muted)] border border-[var(--accent)]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-[var(--accent)]" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-[var(--accent)]">Upgrade to Premium</h4>
              <p className="text-xs text-[var(--muted-foreground)]">Unlock unlimited resumes and all templates</p>
            </div>
          </div>
          <Link href="/dashboard/upgrade">
            <Button size="sm">Upgrade – ₹499</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
