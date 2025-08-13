import api from "@/services/api";
import { type MediaItem } from "@/types";

export const RecognizeService = {
  async RecognizeMedia(title: string): Promise<MediaItem> {
    return await api.get("/recognize/media", { params: { title } });
  },
};
