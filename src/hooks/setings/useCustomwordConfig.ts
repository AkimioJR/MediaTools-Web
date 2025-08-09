import { configService } from "@/services";
import { type CustomWordConfig } from "@/types";
import { computed, ref } from "vue";
import { showError } from "@/utils";

export const useCustomWordConfig = () => {
  const customWordConfig = ref<CustomWordConfig | null>(null);

  const loadData = async () => {
    customWordConfig.value = await configService.getCustomWordConfig();
  };

  const updateData = async () => {
    if (customWordConfig.value !== null) {
      try {
        return await configService.updateCustomWordConfig(
          customWordConfig.value
        );
      } catch (error) {
        showError(
          "保存配置失败，请检查配置是否正确: " + (error as Error).message
        );
      }
    }
  };

  const identifyWordText = computed({
    get: () => {
      if (!customWordConfig.value?.identify_word) {
        return "";
      }
      return customWordConfig.value.identify_word.join("\n");
    },
    set: (txt: string) => {
      if (customWordConfig.value) {
        customWordConfig.value.identify_word = txt
          .split("\n")
          .filter((line) => line.trim());
      }
    },
  });

  const customizationText = computed({
    get: () => {
      if (!customWordConfig.value?.customization) {
        return "";
      }
      return customWordConfig.value.customization.join("\n");
    },
    set: (txt: string) => {
      if (customWordConfig.value) {
        customWordConfig.value.customization = txt
          .split("\n")
          .filter((line) => line.trim());
      }
    },
  });

  const excludeWordsText = computed({
    get: () => {
      if (!customWordConfig.value?.exclude_words) {
        return "";
      }
      return customWordConfig.value.exclude_words.join("\n");
    },
    set: (txt: string) => {
      if (customWordConfig.value) {
        customWordConfig.value.exclude_words = txt
          .split("\n")
          .filter((line) => line.trim());
      }
    },
  });

  const isConfigReady = computed(() => {
    return customWordConfig.value !== null;
  });

  return {
    isConfigReady,

    identifyWordText,
    customizationText,
    excludeWordsText,

    loadData,
    updateData,
  };
};
