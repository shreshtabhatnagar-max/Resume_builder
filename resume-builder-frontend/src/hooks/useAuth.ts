"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { LoginRequest, RegisterRequest } from "@/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function useLogin() {
  const { setUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      setUser(data);
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
      }
      toast.success(`Welcome back, ${data.name}!`);
      router.push("/dashboard");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Login failed. Check your credentials.";
      toast.error(msg);
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      toast.success("Account created! Please verify your email.");
      router.push("/verify-email");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Registration failed.";
      toast.error(msg);
    },
  });
}

export function useProfile() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ["profile"],
    queryFn: authService.getProfile,
    enabled: isAuthenticated,
  });
}
