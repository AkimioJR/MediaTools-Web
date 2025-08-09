<template>
  <!-- 媒体识别弹窗 -->
  <MediaRecognitionDialog
    v-if="isMediaRecognitionDialog"
    v-model:visible="dialogVisible"
    v-bind="activeDialog?.props"
    @success="handleDialogSuccess"
    @update:visible="handleVisibilityChange"
  />

  <!-- 日志弹窗 -->
  <LogDialog
    v-else-if="isLogDialog"
    v-model:visible="dialogVisible"
    v-bind="activeDialog?.props"
    @update:visible="handleVisibilityChange"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";
import MediaRecognitionDialog from "./dialogs/MediaRecognitionDialog.vue";
import LogDialog from "./dialogs/LogDialog.vue";
import { useGlobalDialogs, DialogType } from "@/hooks/useGlobalDialogs";

// 使用全局弹窗管理
const { activeDialog, closeDialog, handleDialogSuccess, handleDialogClose } =
  useGlobalDialogs();

// 计算弹窗可见性
const dialogVisible = computed({
  get: () => activeDialog.value?.visible || false,
  set: (value: boolean) => {
    if (!value && activeDialog.value) {
      closeDialog();
    }
  },
});

// 计算当前弹窗类型
const isMediaRecognitionDialog = computed(
  () => activeDialog.value?.type === DialogType.MEDIA_RECOGNITION
);

const isLogDialog = computed(() => activeDialog.value?.type === DialogType.LOG);

// 处理弹窗可见性变化
const handleVisibilityChange = (visible: boolean) => {
  if (!visible) {
    handleDialogClose();
  }
};
</script>
