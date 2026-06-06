"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authService } from "@/services/auth.service";
import { FileText, Mail, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [resending, setResending] = useState(false);
  const { register, handleSubmit } = useForm<{ email: string }>();

  useEffect(() => {
    if (token) {
      setVerifyStatus("loading");
      authService
        .verifyEmail(token)
        .then(() => {
          setVerifyStatus("success");
          toast.success("Email verified! Redirecting...");
          setTimeout(() => router.push("/login"), 2000);
        })
        .catch(() => {
          setVerifyStatus("error");
          toast.error("Verification failed or token expired.");
        });
    }
  }, [token, router]);

  const handleResend = async ({ email }: { email: string }) => {
    setResending(true);
    try {
      await authService.resendVerification(email);
      toast.success("Verification email sent!");
    } catch {
      toast.error("Failed to send email.");
    } finally {
      setResending(false);
    }
  };

  if (token) {
    return (
      <div className="text-center">
        {verifyStatus === "loading" && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-[var(--accent-muted)] flex items-center justify-center mx-auto animate-pulse">
              <Mail className="w-7 h-7 text-[var(--accent)]" />
            </div>
            <p className="text-[var(--muted-foreground)]">Verifying your email...</p>
          </div>
        )}
        {verifyStatus === "success" && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7 text-green-400" />
            </div>
            <h2 className="font-display text-2xl font-bold">Email Verified!</h2>
            <p className="text-[var(--muted-foreground)]">Redirecting you to login...</p>
          </div>
        )}
        {verifyStatus === "error" && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <h2 className="font-display text-2xl font-bold">Verification Failed</h2>
            <p className="text-[var(--muted-foreground)]">The token may be expired. Request a new one below.</p>
            <Link href="/verify-email">
              <Button variant="ghost">Request new link</Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--accent-muted)] flex items-center justify-center mx-auto mb-4">
          <Mail className="w-7 h-7 text-[var(--accent)]" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">Check your email</h1>
        <p className="text-[var(--muted-foreground)]">
          We sent a verification link to your email. Click it to activate your account.
        </p>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Didn&apos;t receive it? Enter your email to resend.
        </p>
        <form onSubmit={handleSubmit(handleResend)} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            placeholder="you@company.com"
            icon={<Mail className="w-4 h-4" />}
            {...register("email", { required: true })}
          />
          <Button type="submit" loading={resending} className="w-full">
            Resend Verification Email
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
        <Link href="/login" className="text-[var(--accent)] hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <FileText className="w-4 h-4 text-[#080808]" />
          </div>
          <span className="font-display font-bold text-lg">
            Resume<span className="text-[var(--accent)]">Forge</span>
          </span>
        </Link>
        <Suspense fallback={<div className="text-center text-[var(--muted-foreground)]">Loading...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
