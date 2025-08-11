import api from "@/services/api";
import type { LogDetail } from "@/types";

export const LogService = {
  async GetRecentLogs(): Promise<LogDetail[]> {
    return await api.get("/log/recent");
  },
};
