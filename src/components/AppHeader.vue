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
        :key="action.text"
        color="primary"
        variant="elevated"
        size="default"
        class="ml-2 header-btn"
        @click="action.handler"
      >
        <v-icon :icon="action.icon" />
        <span class="btn-text">{{ action.text }}</span>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useThemeManager, useGlobalDialogs } from "@/hooks";

// 按钮动作类型定义
interface HeaderAction {
  text: string; // 按钮文本
  icon: string; // 图标名称
  handler: () => void; // 点击处理函数
}

const { openMediaRecognitionDialog, openLogDialog } = useGlobalDialogs(); // 使用全局弹窗管理
const { currentThemeConfig, toggleTheme } = useThemeManager(); // 使用主题管理hook

// 头部按钮配置
const headerActions = computed<HeaderAction[]>(() => [
  {
    text: "识别媒体",
    icon: "mdi-movie-search",
    handler: openMediaRecognitionDialog,
  },
  {
    text: "查看日志",
    icon: "mdi-text-box-outline",
    handler: openLogDialog,
  },
  {
    text: currentThemeConfig.value.text,
    icon: currentThemeConfig.value.icon,
    handler: toggleTheme,
  },
]);
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
