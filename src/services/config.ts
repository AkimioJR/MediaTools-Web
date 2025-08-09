import api from "@/services/api";
import type {
  LogConfig,
  TMDBConfig,
  FanartConfig,
  LibraryConfig,
  FormatConfig,
  CustomWordConfig,
} from "@/types";
export const configService = {
  async getLogConfig(): Promise<LogConfig> {
    return await api.get("/config/log");
  },
  async updateLogConfig(config: LogConfig): Promise<LogConfig> {
    return await api.post("/config/log", config);
  },

  async getTMDBConfig(): Promise<TMDBConfig> {
    return await api.get("/config/tmdb");
  },

  async updateTMDBConfig(config: TMDBConfig): Promise<TMDBConfig> {
    return await api.post("/config/tmdb", config);
  },

  async getFanartConfig(): Promise<FanartConfig> {
    return await api.get("/config/fanart");
  },
  async updateFanartConfig(config: FanartConfig): Promise<FanartConfig> {
    return await api.post("/config/fanart", config);
  },

  async getMediaLibrariesConfig(): Promise<LibraryConfig[]> {
    return await api.get("/config/media/libraries");
  },
  async updateMediaLibrariesConfig(
    libraries: LibraryConfig[]
  ): Promise<LibraryConfig[]> {
    return await api.post("/config/media/libraries", libraries);
  },

  async getMediaFormatConfig(): Promise<FormatConfig> {
    return await api.get("/config/media/format");
  },
  async updateMediaFormatConfig(format: FormatConfig): Promise<FormatConfig> {
    return await api.post("/config/media/format", format);
  },

  async getCustomWordConfig(): Promise<CustomWordConfig> {
    return await api.get("/config/media/custom_word");
  },
  async updateCustomWordConfig(
    config: CustomWordConfig
  ): Promise<CustomWordConfig> {
    return await api.post("/config/media/custom_word", config);
  },
};
