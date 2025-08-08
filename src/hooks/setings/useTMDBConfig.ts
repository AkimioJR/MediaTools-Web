import { configService } from "@/services";
import { type TMDBConfig } from "@/types";
import { ref, computed } from "vue";

export const useTMDBConfig = () => {
  const tmdbConfig = ref<TMDBConfig | null>(null);

  // 语言选项
  const languageOptions = [
    { label: "简体中文", value: "zh-CN" },
    { label: "繁体中文 (香港)", value: "zh-HK" },
    { label: "繁体中文 (台湾)", value: "zh-TW" },
    { label: "英语 (美国)", value: "en-US" },
    { label: "日语", value: "ja-JP" },
    { label: "韩语", value: "ko-KR" },
  ];

  // 图片语言选项
  const imageLanguageOptions = [
    { label: "中文(zh)", value: "zh" },
    { label: "英文(en)", value: "en" },
    { label: "日文(ja)", value: "ja" },
    { label: "韩文(ko)", value: "ko" },
    { label: "无语言(null)", value: "null" },
  ];

  // 处理多选图片语言的计算属性
  const selectedImageLanguages = computed({
    get: () => {
      if (
        !tmdbConfig.value?.include_image_language ||
        tmdbConfig.value.include_image_language === ""
      ) {
        return [];
      }
      return tmdbConfig.value.include_image_language
        .split(",")
        .filter((lang) => lang.trim());
    },
    set: (languages: string[]) => {
      if (tmdbConfig.value) {
        tmdbConfig.value.include_image_language =
          languages.length > 0 ? languages.join(",") : "";
      }
    },
  });

  const loadData = async () => {
    tmdbConfig.value = await configService.getTMDBConfig();
  };

  const updateData = async () => {
    if (tmdbConfig.value !== null) {
      return await configService.updateTMDBConfig(tmdbConfig.value);
    }
  };

  return {
    tmdbConfig,
    languageOptions,
    imageLanguageOptions,
    selectedImageLanguages,
    loadData,
    updateData,
  };
};
