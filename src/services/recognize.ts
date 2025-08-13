import api from "@/services/api";
import { type RecognizeMediaResponse } from "@/types";

export const RecognizeService = {
  async RecognizeMedia(title: string): Promise<RecognizeMediaResponse> {
    return await api.get("/recognize/media", { params: { title } });
  },
};
