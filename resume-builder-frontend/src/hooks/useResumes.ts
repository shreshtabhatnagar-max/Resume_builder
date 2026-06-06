"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resumeService } from "@/services/resume.service";
import { Resume } from "@/types";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";

export function useResumes() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ["resumes"],
    queryFn: resumeService.getUserResumes,
    enabled: isAuthenticated,
  });
}

export function useResume(id: string) {
  return useQuery({
    queryKey: ["resume", id],
    queryFn: () => resumeService.getResumeById(id),
    enabled: !!id,
  });
}

export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => resumeService.createResume({ title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume created!");
    },
    onError: () => toast.error("Failed to create resume"),
  });
}

export function useUpdateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Resume> }) =>
      resumeService.updateResume(id, data),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["resume", vars.id] });
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Saved!");
    },
    onError: () => toast.error("Failed to save"),
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeService.deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });
}
