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
        class="header-btn"
      >
        <v-icon>{{ action.icon }}</v-icon>
        <v-tooltip activator="parent" location="bottom">
          {{ action.text }}
        </v-tooltip>
      </v-btn>
    </div>
  </v-app-bar>
  <MediaRecognitionDialog
    :visible="mediaRecognitionDialog.visible.value"
    @update:visible="mediaRecognitionDialog.visible.value = $event"
  />
  <LogDialog
    :visible="logDialog.visible.value"
    @update:visible="logDialog.visible.value = $event"
  />
</template>

<script lang="ts" setup name="AppHeader">
import MediaRecognitionDialog from "@/components/dialogs/MediaRecognitionDialog.vue";
import LogDialog from "@/components/dialogs/LogDialog.vue";
import { computed } from "vue";
import { useNavigationManager, useThemeManager, useDialog } from "@/hooks";

const { toggleNavigation } = useNavigationManager();
const { currentThemeConfig, toggleTheme } = useThemeManager();
const mediaRecognitionDialog = useDialog();
const logDialog = useDialog();

// 按钮动作类型定义
interface HeaderAction {
  text: string; // 按钮文本
  icon: string; // 图标名称
  handler: () => void; // 点击处理函数
}

const headerActions = computed<HeaderAction[]>(() => [
  {
    text: "识别媒体",
    icon: "mdi-text-recognition",
    handler: mediaRecognitionDialog.show,
  },
  {
    text: "查看日志",
    icon: "mdi-file-document",
    handler: logDialog.show,
  },
  {
    text: currentThemeConfig.value.text,
    icon: currentThemeConfig.value.icon,
    handler: toggleTheme,
  },
]);
</script>
<style scoped>
.header-btn {
  width: 40px !important;
  min-width: 40px !important;
}
</style>
