<template>
  <template v-if="formatConfig">
    <v-textarea
      v-model="formatConfig.movie"
      label="电影重命名格式"
      class="mb-4"
      auto-grow
      clearable
      rows="1"
      :hint="hint"
    />
    <v-textarea
      v-model="formatConfig.tv"
      label="电视剧重命名格式"
      class="mb-4"
      auto-grow
      clearable
      rows="1"
      :hint="hint"
    />
  </template>
  <!-- 添加右对齐容器 -->
  <div class="d-flex justify-end mt-4">
    <v-btn color="primary" @click="updateData">保存配置</v-btn>
  </div>
</template>

<script lang="ts" setup name="MediaFormatPage">
import { defineExpose } from "vue";
import { useMediaFormatConfig } from "@/hooks";

const hint =
  "使用 text/template 语法，可参考：https://pkg.go.dev/text/template";

const { formatConfig, loadData, updateData } = useMediaFormatConfig();

defineExpose({ loadData });
</script>

<style scoped></style>
