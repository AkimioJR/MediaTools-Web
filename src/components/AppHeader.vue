<template>
  <v-app-bar color="blue-darken-3" dark elevation="2">
    <v-app-bar-title>
      <v-icon icon="mdi-movie-search" class="mr-2" />
      MediaTools - 媒体工具
    </v-app-bar-title>

    <v-spacer />

    <!-- 动态按钮组 -->
    <div class="header-actions">
      <v-btn
        v-for="action in headerActions"
        :key="action.action"
        :color="action.color || 'primary'"
        variant="elevated"
        size="default"
        :loading="action.loading"
        class="ml-2 header-btn"
        @click="handleAction(action)"
      >
        <v-icon v-if="action.icon" :icon="action.icon" />
        <span v-if="action.text" class="btn-text">{{ action.text }}</span>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useThemeManager, useGlobalDialogs } from "@/hooks";
import { type MediaItem } from "@/types";

enum Action {
  MediRecognition = "media-recognition",
  ViewLogs = "view-logs",
  ThemeSwitch = "theme-switch",
}

// 按钮动作类型定义
interface HeaderAction {
  action: Action; // 对应的事件
  text?: string; // 按钮文本
  icon?: string; // 图标名称
  color?: string; // 按钮颜色
  loading?: boolean; // 是否显示加载状态
}

const { openMediaRecognitionDialog, openLogDialog } = useGlobalDialogs(); // 使用全局弹窗管理
const { currentThemeConfig, toggleTheme } = useThemeManager(); // 使用主题管理hook

// 头部按钮配置
const headerActions = computed<HeaderAction[]>(() => [
  {
    action: Action.MediRecognition,
    text: "识别媒体",
    icon: "mdi-movie-search",
    color: "primary",
    variant: "elevated",
    // loading: loadingStates.value["media-recognition"],
  },
  {
    action: Action.ViewLogs,
    text: "查看日志",
    icon: "mdi-text-box-outline",
    color: "primary",
    variant: "elevated",
  },
  {
    action: Action.ThemeSwitch,
    text: currentThemeConfig.value.text,
    icon: currentThemeConfig.value.icon,
    color: "primary",
    variant: "elevated",
  },
]);

// 处理按钮点击
const handleAction = (action: HeaderAction) => {
  switch (action.action) {
    case Action.MediRecognition: // 触发媒体识别事件
      console.log("打开媒体识别对话框");
      openMediaRecognitionDialog();
      break;
    case Action.ViewLogs: // 触发查看日志事件
      console.log("打开日志对话框");
      openLogDialog();
      break;
    case Action.ThemeSwitch: //  触发切换主题事件
      toggleTheme();
      break;
    default:
      console.warn(`未知操作: ${action.action}`);
  }
};
</script>

<style scoped>
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.v-app-bar-title {
  display: flex;
  align-items: center;
}

.header-btn {
  transition: all 0.2s ease-in-out;
}

.btn-text {
  opacity: 0;
  max-width: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: opacity 0.2s ease-in-out, max-width 0.3s ease-in-out;
}

.header-btn:hover .btn-text {
  opacity: 1;
  max-width: 100px; /* 根据需要调整最大宽度 */
  margin-left: 8px;
}
</style>
