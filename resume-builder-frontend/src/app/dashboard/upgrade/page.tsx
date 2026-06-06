"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { paymentService } from "@/services/payment.service";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Crown, CheckCircle, Zap, Star, Shield } from "lucide-react";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: { name: string; email: string };
  theme: { color: string };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const FEATURES = [
  "Unlimited Resumes",
  "All Premium Templates",
  "PDF Export",
  "Email Resume to Recruiters",
  "Priority Support",
  "Custom Color Palettes",
  "Profile Image Upload",
  "Advanced Formatting",
];

export default function UpgradePage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (user?.subscriptionPlan === "premium") {
      toast.success("You're already on Premium!");
      return;
    }

    setLoading(true);
    try {
      const order = await paymentService.createOrder("premium");

      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);

      script.onload = () => {
        const options: RazorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          amount: order.amount,
          currency: order.currency,
          name: "ResumeForge",
          description: "Premium Plan – Lifetime Access",
          order_id: order.OrderId,
          handler: async (response: RazorpayResponse) => {
            try {
              await paymentService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              toast.success("Payment verified! You are now Premium 🎉");
              window.location.reload();
            } catch {
              toast.error("Payment verification failed.");
            }
          },
          prefill: { name: user?.name || "", email: user?.email || "" },
          theme: { color: "#d4f576" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch {
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isPremium = user?.subscriptionPlan === "premium";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-muted)] border border-[var(--accent)]/20 text-[var(--accent)] text-sm font-medium mb-6">
          <Crown className="w-3.5 h-3.5" />
          Upgrade Your Plan
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
          Go Premium. Stand out.
        </h1>
        <p className="text-[var(--muted-foreground)] max-w-xl mx-auto text-lg">
          One-time payment. Lifetime access. Everything you need to land your dream job.
        </p>
      </div>

      {/* Current status */}
      {isPremium ? (
        <div className="mb-10 p-6 bg-[var(--accent-muted)] border border-[var(--accent)]/30 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
            <Crown className="w-6 h-6 text-[#080808]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[var(--accent)]">You&apos;re on Premium!</h3>
            <p className="text-sm text-[var(--muted-foreground)]">Enjoy all premium features. You&apos;re all set.</p>
          </div>
          <Badge variant="accent" className="ml-auto">Active</Badge>
        </div>
      ) : null}

      {/* Plans grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Basic */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl">Basic</h2>
            <Badge variant="default">Current</Badge>
          </div>
          <div className="mb-6">
            <span className="font-display text-5xl font-bold">Free</span>
          </div>
          <ul className="space-y-3 mb-8">
            {["3 Resumes", "Basic Templates", "PDF Export", "Community Support"].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-[var(--muted-foreground)]">
                <CheckCircle className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Button variant="outline" size="lg" className="w-full" disabled>
            Current Plan
          </Button>
        </div>

        {/* Premium */}
        <div className="relative bg-[var(--accent-muted)] border-2 border-[var(--accent)]/40 rounded-2xl p-8 overflow-hidden">
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent pointer-events-none" />

          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl">Premium</h2>
              <span className="flex items-center gap-1 text-xs text-[var(--accent)] font-semibold bg-[var(--accent)]/10 px-3 py-1 rounded-full border border-[var(--accent)]/20">
                <Star className="w-3 h-3" /> Most Popular
              </span>
            </div>
            <div className="mb-2">
              <span className="font-display text-5xl font-bold">₹499</span>
              <span className="text-[var(--muted-foreground)] ml-2 text-sm">one-time</span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mb-6">Lifetime access. No renewals ever.</p>
            <ul className="space-y-3 mb-8">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className="w-full"
              loading={loading}
              onClick={handleUpgrade}
              disabled={isPremium}
            >
              <Crown className="w-4 h-4" />
              {isPremium ? "Already Premium" : "Upgrade Now – ₹499"}
            </Button>
          </div>
        </div>
      </div>

      {/* Trust section */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: <Shield className="w-5 h-5" />, title: "Secure Payment", desc: "Powered by Razorpay. Your data is always safe." },
          { icon: <Zap className="w-5 h-5" />, title: "Instant Access", desc: "Premium unlocks immediately after payment." },
          { icon: <Star className="w-5 h-5" />, title: "Lifetime Deal", desc: "Pay once, use forever. No hidden charges." },
        ].map((item) => (
          <div key={item.title} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex gap-4">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-muted)] text-[var(--accent)] flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-[var(--muted-foreground)]">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
