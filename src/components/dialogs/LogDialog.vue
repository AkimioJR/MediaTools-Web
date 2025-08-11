<template>
  <BaseDialog v-model:visible="dialogVisible" title="最新日志" max-width="900">
    <v-card class="log-dialog" variant="flat" height="600">
      <!-- 日志表格 -->
      <v-table fixed-header height="480" class="log-table" density="compact">
        <thead>
          <tr>
            <th class="text-left log-level-col">等级</th>
            <th class="text-left log-time-col">时间</th>
            <th class="text-left log-message-col">内容</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(log, index) in logs"
            :key="index"
            :class="getLogRowClass(log.level)"
          >
            <td class="log-level-cell">
              <v-chip :color="getLogLevelColor(log.level)" size="x-small">
                {{ getLogLevelText(log.level) }}
              </v-chip>
            </td>
            <td class="log-time-cell">
              {{ formatTime(log.time) }}
            </td>
            <td class="log-message-cell">
              <div class="log-message-content">
                {{ log.message }}
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-divider />

      <v-card-title class="d-flex align-center px-4 py-2">
        <v-chip v-if="errMsg" size="small" color="error" class="mr-3">
          <v-icon start icon="mdi-alert-circle" size="16" />
          {{ errMsg }}
        </v-chip>
        <v-chip
          v-else-if="logs.length === 0 && !loading"
          size="small"
          color="warning"
        >
          <v-icon start icon="mdi-circle" size="8" />
          暂无日志数据
        </v-chip>
        <v-chip v-else size="small" color="success">
          <v-icon start icon="mdi-circle" size="8" />
          实时更新中
        </v-chip>
      </v-card-title>
    </v-card>
  </BaseDialog>
</template>

<script lang="ts" setup name="LogDialog">
import BaseDialog from "./BaseDialog.vue";

import { defineProps, ref, defineEmits, computed, onUnmounted } from "vue";

import { type DialogEmit } from "@/hooks";
import { type LogDetail } from "@/types";
import { LogService } from "@/services/log";

const props = defineProps<{
  visible: boolean; // 是否可见
}>();
const emit = defineEmits<DialogEmit>();

const logs = ref<LogDetail[]>([]);
const errMsg = ref<string>("");
const loading = ref<boolean>(false);

const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit("update:visible", value),
});

// 日志等级颜色映射
const getLogLevelColor = (level: string) => {
  const colorMap: Record<string, string> = {
    trace: "grey",
    debug: "blue",
    info: "green",
    warning: "orange",
    error: "red",
  };
  return colorMap[level] || "grey";
};

// 日志等级文本映射
const getLogLevelText = (level: string) => {
  const textMap: Record<string, string> = {
    trace: "跟踪",
    debug: "调试",
    info: "信息",
    warning: "警告",
    error: "错误",
  };
  return textMap[level] || level.toUpperCase();
};

// 获取日志行样式
const getLogRowClass = (level: string) => {
  return `log-row log-row--${level}`;
};

// 格式化时间显示
const formatTime = (timeStr: string) => {
  try {
    const date = new Date(timeStr);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return timeStr;
  }
};

// 定时刷新日志
const intervalId = setInterval(async () => {
  if (!dialogVisible.value || loading.value) return;

  console.log("开始获取最新日志");
  try {
    logs.value = await LogService.GetRecentLogs();
    errMsg.value = "";
  } catch (error) {
    errMsg.value = "获取日志失败: " + (error as Error).message;
    console.error("获取日志失败:", error);
  }
}, 2000);

// 组件卸载时清理定时器
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
/* 日志行样式 */
.log-row {
  transition: background-color 0.2s ease;
}

.log-row:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.04) !important;
}

.log-row--error {
  background-color: rgba(var(--v-theme-error), 0.05);
}

.log-row--warning {
  background-color: rgba(var(--v-theme-warning), 0.05);
}

.log-row--error:hover {
  background-color: rgba(var(--v-theme-error), 0.08) !important;
}

.log-row--warning:hover {
  background-color: rgba(var(--v-theme-warning), 0.08) !important;
}
</style>
