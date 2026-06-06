import apiClient from "@/lib/axios";
import { Resume, CreateResumeRequest } from "@/types";

export const resumeService = {
  createResume: async (data: CreateResumeRequest): Promise<Resume> => {
    const res = await apiClient.post("/api/resumes", data);
    return res.data;
  },

  getUserResumes: async (): Promise<Resume[]> => {
    const res = await apiClient.get("/api/resumes");
    return res.data;
  },

  getResumeById: async (id: string): Promise<Resume> => {
    const res = await apiClient.get(`/api/resumes/${id}`);
    return res.data;
  },

  updateResume: async (id: string, data: Partial<Resume>): Promise<Resume> => {
    const res = await apiClient.put(`/api/resumes/${id}`, data);
    return res.data;
  },

  deleteResume: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/resumes/${id}`);
  },

  uploadResumeImages: async (
    id: string,
    thumbnail?: File,
    profileImage?: File
  ): Promise<{ thumbnail?: string; profileImage?: string }> => {
    const form = new FormData();
    if (thumbnail) form.append("thumbnail", thumbnail);
    if (profileImage) form.append("profileImage", profileImage);
    const res = await apiClient.put(`/api/resumes/${id}/upload-images`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
