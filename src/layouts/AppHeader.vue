<template>
  <v-app-bar>
    <v-app-bar-nav-icon @click="toggleNavigation"></v-app-bar-nav-icon>

    <!-- <v-app-bar-title>MediaTools</v-app-bar-title> -->

    <!-- 空间占位符，下面的按钮在右侧 -->
    <v-spacer />

    <div class="header-actions">
      <v-btn
        v-for="action in headerActions"
        :key="action.text"
        color="primary"
        @click="action.handler"
      >
        <v-icon>{{ action.icon }}</v-icon>
        <v-tooltip activator="parent" location="bottom">
          {{ action.text }}
        </v-tooltip>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script lang="ts" setup name="AppHeader">
import { computed } from "vue";
import { useNavigationManager, useThemeManager } from "@/hooks";

const { toggleNavigation } = useNavigationManager();
const { currentThemeConfig, toggleTheme } = useThemeManager();

// 按钮动作类型定义
interface HeaderAction {
  text: string; // 按钮文本
  icon: string; // 图标名称
  handler: () => void; // 点击处理函数
}

const headerActions = computed<HeaderAction[]>(() => [
  {
    text: currentThemeConfig.value.text,
    icon: currentThemeConfig.value.icon,
    handler: toggleTheme,
  },
]);
</script>

<style scoped></style>
