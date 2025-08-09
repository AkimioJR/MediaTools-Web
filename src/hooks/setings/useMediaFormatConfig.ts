import { configService } from "@/services";
import { type FormatConfig } from "@/types";
import { ref } from "vue";
import { showError } from "@/utils";

export const useMediaFormatConfig = () => {
  const formatConfig = ref<FormatConfig | null>(null);

  const loadData = async () => {
    formatConfig.value = await configService.getMediaFormatConfig();
  };

  const updateData = async () => {
    if (formatConfig.value !== null) {
      try {
        return await configService.updateMediaFormatConfig(formatConfig.value);
      } catch (error) {
        showError(
          "保存配置失败，请检查配置是否正确: " + (error as Error).message
        );
      }
    }
  };

  return {
    formatConfig,

    loadData,
    updateData,
  };
};
