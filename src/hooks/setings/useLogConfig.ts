import { configService } from "@/services";
import { type LogConfig } from "@/types";
import { ref } from "vue";

export const useLogConfig = () => {
  const logConfig = ref<LogConfig | null>(null);

  const loadData = async () => {
    logConfig.value = await configService.getLogConfig();
  };

  const updateData = async () => {
    if (logConfig.value !== null) {
      return await configService.updateLogConfig(logConfig.value);
    }
  };

  return {
    logConfig,

    loadData,
    updateData,
  };
};
