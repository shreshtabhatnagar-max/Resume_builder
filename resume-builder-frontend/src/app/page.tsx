"use client";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Zap, Shield, Layers, Star, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] noise-bg">
      <Navbar />
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-muted)] border border-[var(--accent)]/20 text-[var(--accent)] text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" />
            Build professional resumes in minutes
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            Your career story,{" "}
            <span className="gradient-text">beautifully told</span>
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10 leading-relaxed">
            ResumeForge helps you create ATS-friendly, professionally designed resumes that stand out. Built for modern job seekers who refuse to blend in.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Start Building Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="lg">Sign In</Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">No credit card required</p>
        </div>

        <div className="max-w-3xl mx-auto mt-20 relative z-10">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[var(--border)] flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-[var(--muted-foreground)]">ResumeForge Editor</span>
            </div>
            <div className="p-8 grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-2.5 bg-[var(--accent)]/20 rounded-full w-3/4" />
                <div className="h-2 bg-white/5 rounded-full w-full" />
                <div className="h-2 bg-white/5 rounded-full w-4/5" />
                <div className="h-2 bg-white/5 rounded-full w-2/3" />
              </div>
              <div className="space-y-3">
                {[80, 65, 90, 75, 50].map((w, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-1.5 bg-white/5 rounded-full w-1/3" />
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--accent)]/40 rounded-full" style={{ width: `${w}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">Everything you need to land the job</h2>
            <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">Powerful features designed to make your resume creation effortless.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Layers className="w-5 h-5" />, title: "Premium Templates", desc: "Choose from beautifully crafted templates designed by professionals." },
              { icon: <Zap className="w-5 h-5" />, title: "Instant Export", desc: "Export your resume as a PDF. Email it directly to recruiters from the app." },
              { icon: <Shield className="w-5 h-5" />, title: "ATS Optimized", desc: "Every template is tested against Applicant Tracking Systems to ensure your resume gets seen." },
            ].map((f) => (
              <div key={f.title} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 hover:border-[#2a2a2a] transition-all">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-muted)] text-[var(--accent)] flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Basic", price: "Free", features: ["3 Resumes", "Basic Templates", "PDF Export", "Email Support"], cta: "Get Started", href: "/register", accent: false },
              { name: "Premium", price: "₹499", period: "/one-time", features: ["Unlimited Resumes", "All Templates", "Email Resume", "Priority Support"], cta: "Upgrade to Premium", href: "/dashboard/upgrade", accent: true },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-8 border ${plan.accent ? "bg-[var(--accent-muted)] border-[var(--accent)]/30" : "bg-[var(--card)] border-[var(--border)]"}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-bold text-xl">{plan.name}</h3>
                  {plan.accent && <span className="flex items-center gap-1 text-xs text-[var(--accent)] font-medium"><Star className="w-3.5 h-3.5" /> Most Popular</span>}
                </div>
                <div className="mb-6">
                  <span className="font-display text-4xl font-bold">{plan.price}</span>
                  {"period" in plan && plan.period && <span className="text-[var(--muted-foreground)] text-sm ml-1">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button variant={plan.accent ? "accent" : "outline"} size="lg" className="w-full">{plan.cta}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display font-bold text-sm">Resume<span className="text-[var(--accent)]">Forge</span></span>
          <p className="text-xs text-[var(--muted-foreground)]">© {new Date().getFullYear()} ResumeForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
