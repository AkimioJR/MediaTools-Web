<template>
  <!-- 成功结果 -->
  <v-card v-if="mediaItem && mediaItem.title" variant="flat">
    <v-card-title class="d-flex align-center bg-success py-2">
      <v-icon class="mr-2 text-white">{{
        isTV ? "mdi-television-classic" : "mdi-movie"
      }}</v-icon>
      <div class="text-white">
        <div class="text-h6">{{ mediaItem.title }}</div>
        <div class="text-caption">
          {{ mediaItem.year }} | {{ mediaItem.media_type }}
        </div>
      </div>
    </v-card-title>
    <v-card-text class="pa-3">
      <v-row dense>
        <!-- 海报区域 -->
        <Poster :mediaItem="mediaItem" class="poster" />

        <!-- 信息区域 -->
        <v-col cols="12" md="9">
          <v-tabs v-model="activeTab" color="primary" class="mb-3">
            <v-tab value="basic">基本信息</v-tab>
            <v-tab value="overview">简介</v-tab>
            <v-tab value="resource">资源信息</v-tab>
            <v-tab v-if="isTV" value="tv">电视剧信息</v-tab>
          </v-tabs>

          <v-tabs-window v-model="activeTab">
            <!-- 基本信息 -->
            <v-tabs-window-item value="basic">
              <BaseInfo :mediaItem="mediaItem" :isTV="isTV" />
            </v-tabs-window-item>

            <!-- 简介 -->
            <v-tabs-window-item value="overview">
              <OverView :mediaItem="mediaItem" />
            </v-tabs-window-item>

            <!-- 资源信息 -->
            <v-tabs-window-item value="resource">
              <ResourceInfo :mediaItem="mediaItem" />
            </v-tabs-window-item>

            <!-- 电视剧信息 -->
            <v-tabs-window-item v-if="isTV" value="tv">
              <TVInfo :mediaItem="mediaItem" />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <!-- 错误结果 -->
  <v-card v-else-if="errMsg" class="elevation-1">
    <v-card-title class="d-flex align-center bg-error py-2">
      <v-icon class="mr-2 text-white">mdi-alert-circle</v-icon>
      <div class="text-white">
        <div class="text-h6">识别失败</div>
      </div>
    </v-card-title>
    <v-card-text class="pa-3">
      <v-alert type="error" variant="tonal" class="mb-0" :text="errMsg" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup name="MediaDetail">
import { defineProps, ref, computed } from "vue";

import type { MediaItem } from "@/types";

import Poster from "./Poster.vue";
import BaseInfo from "./BaseInfo.vue";
import OverView from "./OverView.vue";
import ResourceInfo from "./ResourceInfo.vue";
import TVInfo from "./TVInfo.vue";

const props = defineProps<{
  mediaItem: MediaItem | null;
  errMsg: string | null;
}>();
const activeTab = ref("basic");
const isTV = computed(() => props.mediaItem?.media_type === "TV");
</script>
