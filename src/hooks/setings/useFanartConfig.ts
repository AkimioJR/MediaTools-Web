import { ref } from "vue";
import { configService } from "@/services";
import { type FanartConfig } from "@/types";

export const useFanartConfig = () => {
  const fanartConfig = ref<FanartConfig | null>(null);

  // 语言选项
  const languageOptions = [
    { label: "中文(zh)", value: "zh" },
    { label: "英文(en)", value: "en" },
    { label: "德语(de)", value: "de" },
    { label: "法语(fr)", value: "fr" },
    { label: "日文(ja)", value: "ja" },
    { label: "韩文(ko)", value: "ko" },
  ];

  const loadData = async () => {
    fanartConfig.value = await configService.getFanartConfig();
  };

  const updateData = async () => {
    if (fanartConfig.value !== null) {
      return await configService.updateFanartConfig(fanartConfig.value);
    }
  };

  return {
    fanartConfig,
    languageOptions,

    loadData,
    updateData,
  };
};
