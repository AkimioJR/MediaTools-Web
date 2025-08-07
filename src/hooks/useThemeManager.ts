import { ref, watch, onUnmounted } from "vue";
import { useTheme } from "vuetify";

// 主题模式类型
export type ThemeMode = "system" | "light" | "dark";

// 主题配置
export interface ThemeConfig {
  value: ThemeMode;
  text: string;
  icon: string;
}

// 主题模式配置
export const themeModes: ThemeConfig[] = [
  { value: "system", text: "跟随系统", icon: "mdi-brightness-auto" },
  { value: "light", text: "亮色主题", icon: "mdi-brightness-7" },
  { value: "dark", text: "暗色主题", icon: "mdi-brightness-4" },
];

/**
 * 主题管理Hook
 */
export function useThemeManager() {
  const theme = useTheme();
  const themeMode = ref<ThemeMode>(
    (localStorage.getItem("themeMode") as ThemeMode) || "system"
  );

  // 获取当前主题配置
  const currentThemeConfig = ref<ThemeConfig>(
    themeModes.find((t) => t.value === themeMode.value) || themeModes[0]
  );

  // 主题切换逻辑
  const setTheme = (mode: ThemeMode) => {
    themeMode.value = mode;
    localStorage.setItem("themeMode", mode);

    currentThemeConfig.value =
      themeModes.find((t) => t.value === mode) || themeModes[0]; // 更新当前主题配置信息
    theme.change(mode); // 设置Vuetify主题
  };

  // 切换到下一个主题
  const toggleTheme = () => {
    const currentIndex = themeModes.findIndex(
      (t) => t.value === themeMode.value
    );
    const nextIndex = (currentIndex + 1) % themeModes.length;
    setTheme(themeModes[nextIndex].value);
  };

  // 监听系统主题变化
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    if (themeMode.value === "system") {
      theme.change(e.matches ? "dark" : "light");
    }
  };

  // 添加系统主题变化监听器
  mediaQuery.addEventListener("change", handleSystemThemeChange);

  // 初始化主题
  watch(
    themeMode,
    (mode) => {
      setTheme(mode);
    },
    { immediate: true }
  );

  // 清理监听器
  onUnmounted(() => {
    mediaQuery.removeEventListener("change", handleSystemThemeChange);
  });

  return {
    // 状态
    themeMode,
    currentThemeConfig,
    themeModes,

    // 方法
    setTheme,
    toggleTheme,
  };
}
