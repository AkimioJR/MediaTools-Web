<template>
  <template v-if="logConfig">
    <v-select
      v-model="logConfig.level"
      label="日志级别"
      :items="logLevels"
      item-title="label"
      item-value="value"
      class="mb-4"
      clearable
    />
    <v-text-field
      v-model="logConfig.path"
      label="日志路径"
      class="mb-4"
      clearable
    />
  </template>
  <div class="d-flex justify-end mt-4">
    <v-btn color="primary" @click="updateData">保存配置</v-btn>
  </div>
</template>

<script lang="ts" setup name="LogPage">
import { defineExpose } from "vue";
import { useLogConfig } from "@/hooks";

const { logConfig, loadData, updateData } = useLogConfig();

// 定义日志级别选项
const logLevels = [
  { label: "Debug", value: "debug" },
  { label: "Info", value: "info" },
  { label: "Warning", value: "warning" },
  { label: "Error", value: "error" },
];

defineExpose({ loadData });
</script>

<style scoped></style>
