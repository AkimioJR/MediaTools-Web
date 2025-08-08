import { configService } from "@/services";
import { type FormatConfig } from "@/types";
import { ref } from "vue";

export const useMediaFormatConfig = () => {
  const formatConfig = ref<FormatConfig | null>(null);

  const loadData = async () => {
    formatConfig.value = await configService.getMediaFormatConfig();
  };

  const updateData = async () => {
    if (formatConfig.value !== null) {
      return await configService.updateMediaFormatConfig(formatConfig.value);
    }
  };

  return {
    formatConfig,

    loadData,
    updateData,
  };
};
