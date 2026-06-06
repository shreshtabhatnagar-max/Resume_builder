"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLogin } from "@/hooks/useAuth";
import { FileText, Mail, Lock } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-[var(--card)] border-r border-[var(--border)] flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <FileText className="w-4 h-4 text-[#080808]" />
          </div>
          <span className="font-display font-bold text-lg">
            Resume<span className="text-[var(--accent)]">Forge</span>
          </span>
        </Link>

        <div>
          <blockquote className="text-2xl font-display font-medium leading-relaxed mb-4">
            &ldquo;Your resume is your first impression. Make it count.&rdquo;
          </blockquote>
          <p className="text-[var(--muted-foreground)] text-sm">— Built for ambitious professionals</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {["Templates", "Export PDF", "Email Resume"].map((f) => (
            <div key={f} className="p-4 bg-[var(--background)] rounded-xl border border-[var(--border)] text-sm text-center text-[var(--muted-foreground)]">
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 lg:hidden mb-8">
              <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-[#080808]" />
              </div>
              <span className="font-display font-bold">Resume<span className="text-[var(--accent)]">Forge</span></span>
            </Link>
            <h1 className="font-display text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-[var(--muted-foreground)]">
              Sign in to continue building your career story.
            </p>
          </div>

          <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register("password")}
            />

            <Button type="submit" loading={isPending} size="lg" className="w-full mt-2">
              Sign In
            </Button>
          </form>

          <div className="mt-6 space-y-3 text-center text-sm text-[var(--muted-foreground)]">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[var(--accent)] hover:underline">
                Create one free
              </Link>
            </p>
            <p>
              Didn&apos;t verify your email?{" "}
              <Link href="/verify-email" className="text-[var(--foreground)] hover:underline">
                Resend verification
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
