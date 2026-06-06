import apiClient from "@/lib/axios";

export const emailService = {
  sendResume: async (params: {
    recipientEmail: string;
    subject: string;
    message: string;
    pdfFile: File;
  }): Promise<{ success: boolean; message: string }> => {
    const form = new FormData();
    form.append("recipientEmail", params.recipientEmail);
    form.append("subject", params.subject);
    form.append("message", params.message);
    form.append("pdfFile", params.pdfFile);
    const res = await apiClient.post("/api/email/send-resume", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};
