import apiClient from "@/lib/axios";

export const templateService = {
  getTemplates: async (): Promise<Record<string, unknown>> => {
    const res = await apiClient.get("/api/templates");
    return res.data;
  },
};
