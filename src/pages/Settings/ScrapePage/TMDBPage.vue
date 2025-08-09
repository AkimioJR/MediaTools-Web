<template>
  <template v-if="tmdbConfig">
    <v-row class="mb-4">
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="tmdbConfig.api_url"
          label="TMDB API 地址（v3）"
          clearable
          placeholder="https://api.themoviedb.org"
          density="comfortable"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="tmdbConfig.image_url"
          label="TMDB 图片地址"
          clearable
          placeholder="https://image.tmdb.org"
          density="comfortable"
        />
      </v-col>
    </v-row>

    <v-text-field
      v-model="tmdbConfig.api_key"
      label="TMDB API 密钥"
      class="mb-4"
      clearable
      placeholder="请输入您的 TMDB API Key"
    />

    <v-row class="mb-4">
      <v-col cols="12" sm="6">
        <v-select
          v-model="tmdbConfig.language"
          label="语言设置"
          :items="languageOptions"
          item-title="label"
          item-value="value"
          clearable
          density="comfortable"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          v-model="selectedImageLanguages"
          label="包含的图片语言"
          :items="imageLanguageOptions"
          item-title="label"
          item-value="value"
          multiple
          chips
          clearable
          hint="可多选"
          persistent-hint
          density="comfortable"
        />
      </v-col>
    </v-row>
  </template>
  <div class="d-flex justify-end mt-4">
    <v-btn color="primary" @click="updateData">保存配置</v-btn>
  </div>
</template>

<script lang="ts" setup name="TMDBPage">
import { defineExpose } from "vue";
import { useTMDBConfig } from "@/hooks";

const {
  tmdbConfig,
  languageOptions,
  imageLanguageOptions,
  selectedImageLanguages,
  loadData,
  updateData,
} = useTMDBConfig();

defineExpose({ loadData });
</script>

<style scoped></style>
