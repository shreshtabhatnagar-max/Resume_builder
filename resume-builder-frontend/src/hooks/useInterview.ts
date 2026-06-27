"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { interviewService } from "@/services/interview.service";
import toast from "react-hot-toast";

export function useStartInterview() {
  return useMutation({
    mutationFn: ({ cv, roleTitle }: { cv: File; roleTitle: string }) =>
      interviewService.startInterview(cv, roleTitle),
    onError: () => toast.error("Failed to start interview. Please try again."),
  });
}

export function useSubmitAnswer() {
  return useMutation({
    mutationFn: ({
      sessionId,
      questionId,
      audioBlob,
    }: {
      sessionId: number;
      questionId: number;
      audioBlob: Blob;
    }) => interviewService.submitAnswer(sessionId, questionId, audioBlob),
    onError: () => toast.error("Failed to submit answer. Please try again."),
  });
}

export function useInterviewReport(sessionId: number | null) {
  return useQuery({
    queryKey: ["interview-report", sessionId],
    queryFn: () => interviewService.getReport(sessionId as number),
    enabled: !!sessionId,
  });
}