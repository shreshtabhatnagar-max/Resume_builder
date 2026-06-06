"use client";
import { useQuery } from "@tanstack/react-query";
import { templateService } from "@/services/template.service";
import { useAuthStore } from "@/store/auth.store";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Crown, Layers, CheckCircle } from "lucide-react";
import Link from "next/link";

const BUILT_IN_TEMPLATES = [
  { id: "modern", name: "Modern Minimal", desc: "Clean lines, bold typography. Perfect for tech roles.", theme: "modern", palette: ["#d4f576", "#080808", "#f5f5f0"], isPremium: false, category: "Minimal" },
  { id: "classic", name: "Classic Professional", desc: "Timeless design trusted by Fortune 500 recruiters.", theme: "classic", palette: ["#1a1a2e", "#16213e", "#0f3460"], isPremium: false, category: "Professional" },
  { id: "bold", name: "Bold Creative", desc: "Stand out with strong visual hierarchy.", theme: "bold", palette: ["#ff6b35", "#f7c59f", "#efefd0"], isPremium: true, category: "Creative" },
  { id: "elegant", name: "Elegant Dark", desc: "Sophisticated dark theme for senior professionals.", theme: "elegant", palette: ["#c9a96e", "#1c1c1c", "#f5f5f5"], isPremium: true, category: "Executive" },
  { id: "tech", name: "Tech Focused", desc: "Developer-friendly layout with skills emphasis.", theme: "tech", palette: ["#00d4ff", "#090b10", "#7928ca"], isPremium: true, category: "Tech" },
  { id: "minimal", name: "Ultra Minimal", desc: "Let your content shine with zero distractions.", theme: "minimal", palette: ["#000000", "#ffffff", "#888888"], isPremium: false, category: "Minimal" },
];

export default function TemplatesPage() {
  const { user } = useAuthStore();
  const isPremium = user?.subscriptionPlan === "premium";

  const { isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: templateService.getTemplates,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Resume Templates</h1>
            <p className="text-[var(--muted-foreground)]">Choose a template to power your next resume.</p>
          </div>
          {!isPremium && (
            <Link href="/dashboard/upgrade">
              <Button className="gap-2"><Crown className="w-4 h-4" />Unlock All Templates</Button>
            </Link>
          )}
        </div>
        {isPremium ? (
          <div className="mt-5 p-4 bg-[var(--accent-muted)] border border-[var(--accent)]/20 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[var(--accent)]" />
            <span className="text-sm text-[var(--accent)] font-medium">You have Premium access — all templates are unlocked!</span>
          </div>
        ) : (
          <div className="mt-5 p-4 bg-[var(--card)] border border-[var(--border)] rounded-xl flex items-center gap-3">
            <Layers className="w-5 h-5 text-[var(--muted-foreground)]" />
            <span className="text-sm text-[var(--muted-foreground)]">
              Basic plan — 3 templates available.{" "}
              <Link href="/dashboard/upgrade" className="text-[var(--accent)] hover:underline">Upgrade for all →</Link>
            </span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BUILT_IN_TEMPLATES.map((tmpl) => {
            const locked = tmpl.isPremium && !isPremium;
            return (
              <div key={tmpl.id} className={`group relative bg-[var(--card)] border rounded-2xl overflow-hidden transition-all duration-200 ${locked ? "border-[var(--border)] opacity-70" : "border-[var(--border)] hover:border-[#2a2a2a]"}`}>
                <div className="h-44 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${tmpl.palette[0]}20, ${tmpl.palette[2]}15)` }}>
                  <div className="absolute inset-4 space-y-2">
                    <div className="h-3 rounded-full w-2/3" style={{ background: tmpl.palette[0], opacity: 0.6 }} />
                    <div className="h-2 rounded-full w-1/2 bg-white/10" />
                    <div className="mt-3 space-y-1.5">
                      {[90, 70, 80].map((w, i) => (<div key={i} className="h-1.5 rounded-full bg-white/10" style={{ width: `${w}%` }} />))}
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    {tmpl.palette.map((c, i) => (<div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ background: c }} />))}
                  </div>
                  {locked && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--card)] rounded-full border border-[var(--border)] text-xs font-medium">
                        <Crown className="w-3 h-3 text-[var(--accent)]" />Premium Only
                      </div>
                    </div>
                  )}
                  {tmpl.isPremium && <div className="absolute top-3 right-3"><Badge variant="accent">Pro</Badge></div>}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-display font-semibold">{tmpl.name}</h3>
                    <Badge variant="default" className="text-[10px] flex-shrink-0">{tmpl.category}</Badge>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">{tmpl.desc}</p>
                  {locked ? (
                    <Link href="/dashboard/upgrade"><Button variant="ghost" size="sm" className="w-full gap-2"><Crown className="w-3.5 h-3.5 text-[var(--accent)]" />Unlock with Premium</Button></Link>
                  ) : (
                    <Link href="/dashboard"><Button variant="outline" size="sm" className="w-full">Use this Template</Button></Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
