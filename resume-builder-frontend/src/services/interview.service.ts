import apiClient from "@/lib/axios";
import {
  InterviewSessionResponse,
  AnswerResponse,
  InterviewReportResponse,
} from "@/types";

export const interviewService = {
  startInterview: async (cv: File, roleTitle: string): Promise<InterviewSessionResponse> => {
    const form = new FormData();
    form.append("cv", cv);
    form.append("roleTitle", roleTitle);
    const res = await apiClient.post("/api/interview/start", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  submitAnswer: async (
    sessionId: number,
    questionId: number,
    audioBlob: Blob
  ): Promise<AnswerResponse> => {
    const form = new FormData();
    form.append("audio", audioBlob, "answer.webm");
    const res = await apiClient.post(
      `/api/interview/${sessionId}/answer/${questionId}`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  },

  getReport: async (sessionId: number): Promise<InterviewReportResponse> => {
    const res = await apiClient.get(`/api/interview/${sessionId}/report`);
    return res.data;
  },
};