"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRegister } from "@/hooks/useAuth";
import { FileText, Mail, Lock, User } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(15),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(15)
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=]).*$/,
      "Must include uppercase, lowercase, number and special character (@#$%^&+=)"
    ),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { mutate: register, isPending } = useRegister();

  const {
    register: formReg,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <FileText className="w-4 h-4 text-[#080808]" />
          </div>
          <span className="font-display font-bold text-lg">
            Resume<span className="text-[var(--accent)]">Forge</span>
          </span>
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-[var(--muted-foreground)]">
            Start building your professional resume today. Free forever.
          </p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <form
            onSubmit={handleSubmit((data) => register(data))}
            className="space-y-4"
          >
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              {...formReg("name")}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...formReg("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 chars with uppercase, number &amp; symbol"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...formReg("password")}
            />

            <Button type="submit" loading={isPending} size="lg" className="w-full mt-2">
              Create Free Account
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--accent)] hover:underline">
            Sign in
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-[var(--muted-foreground)]">
          By creating an account, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
