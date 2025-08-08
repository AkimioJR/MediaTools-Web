<template>
  <template v-if="fanartConfig">
    <v-text-field
      v-model="fanartConfig.api_url"
      label="Fanart API 地址（v3）"
      class="mb-4"
      clearable
      placeholder="https://webservice.fanart.tv"
    />

    <v-text-field
      v-model="fanartConfig.api_key"
      label="Fanart API 密钥"
      class="mb-4"
      clearable
      placeholder="请输入您的 Fanart API Key"
    />

    <v-select
      v-model="fanartConfig.languages"
      label="语言设置"
      :items="languageOptions"
      item-title="label"
      item-value="value"
      class="mb-4"
      multiple
      chips
      clearable
      hint="可多选，按选择顺序排列"
      persistent-hint
    />
  </template>
  <v-btn color="primary" class="mt-4" @click="updateData"> 保存配置 </v-btn>
</template>

<script lang="ts" setup name="TMDBPage">
import { defineExpose } from "vue";
import { useFanartConfig } from "@/hooks";

const { fanartConfig, languageOptions, loadData, updateData } =
  useFanartConfig();

defineExpose({ loadData });
</script>

<style scoped></style>
