import apiClient from "@/lib/axios";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types";

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post("/api/auth/register", data);
    return res.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post("/api/auth/login", data);
    return res.data;
  },

  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.get(`/api/auth/verify-email?token=${token}`);
  },

  resendVerification: async (email: string): Promise<void> => {
    await apiClient.post("/api/auth/resend-verification", { email });
  },

  getProfile: async (): Promise<AuthResponse> => {
    const res = await apiClient.get("/api/auth/profile");
    return res.data;
  },

  uploadProfileImage: async (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append("image", file);
    const res = await apiClient.post("/api/auth/upload_image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
