<template>
  <BaseDialog v-model:visible="dialogVisible" title="最新日志" max-width="800">
    <v-card class="log-dialog" variant="flat">
      <v-table fixed-header>
        <thead>
          <tr>
            <th class="text-left">日志等级</th>
            <th class="text-left">时间</th>
            <th class="text-left">内容</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(log, index) in logs" :key="index">
            <td>{{ log.level }}</td>
            <td>{{ log.time }}</td>
            <td>{{ log.message }}</td>
          </tr>
        </tbody>
      </v-table>

      <v-divider />

      <v-card-actions class="px-4 py-3">
        <v-chip v-if="errMsg" size="small" color="error" class="mr-2">
          <v-icon start icon="mdi-circle" size="8" />
          {{ errMsg }}
        </v-chip>
        <v-chip v-else size="small" color="success" class="mr-2">
          <v-icon start icon="mdi-circle" size="8" />
          实时更新中
        </v-chip>
      </v-card-actions>
    </v-card>
  </BaseDialog>
</template>

<script lang="ts" setup name="LogDialog">
import BaseDialog from "./BaseDialog.vue";

import { defineProps, ref, defineEmits, computed } from "vue";

import { type DialogEmit } from "@/hooks";
import { type LogDetail } from "@/types";
import { LogService } from "@/services/log";

const props = defineProps<{
  visible: boolean; // 是否可见
}>();
const emit = defineEmits<DialogEmit>();

const logs = ref<LogDetail[]>([]);
const errMsg = ref<string>("");
const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit("update:visible", value),
});

// 刷新日志
setInterval(async () => {
  if (!dialogVisible.value) return;

  console.log("开始获取最新日志");
  try {
    logs.value = await LogService.GetRecentLogs();
    errMsg.value = "";
  } catch (error) {
    errMsg.value = "获取日志失败: " + (error as Error).message;
    console.error("获取日志失败:", error);
  }
}, 2000);
</script>

<style scoped></style>
