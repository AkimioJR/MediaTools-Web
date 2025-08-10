<template>
  <v-row dense>
    <v-col cols="12" sm="6">
      <v-list density="compact" class="pa-0">
        <v-list-item v-if="mediaItem.platform" class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >流媒体平台</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">{{
            mediaItem.platform
          }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="mediaItem.resource_type" class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >资源类型</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">{{
            mediaItem.resource_type
          }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="mediaItem.resource_pix" class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >分辨率</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">{{
            mediaItem.resource_pix
          }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="mediaItem.video_encode" class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >视频编码</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">{{
            mediaItem.video_encode
          }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col cols="12" sm="6">
      <v-list density="compact" class="pa-0">
        <v-list-item v-if="mediaItem.audio_encode" class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >音频编码</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">{{
            mediaItem.audio_encode
          }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="mediaItem.part" class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >分段</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">{{
            mediaItem.part
          }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >版本号</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">{{
            mediaItem.version
          }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="mediaItem.resource_effect?.length" class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >资源效果</v-list-item-title
          >
          <v-list-item-subtitle>
            <v-chip
              v-for="effect in mediaItem.resource_effect"
              :key="effect"
              size="x-small"
              class="mr-1 mt-1"
              color="secondary"
              variant="tonal"
            >
              {{ effect }}
            </v-chip>
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="mediaItem.release_groups?.length" class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >发布组</v-list-item-title
          >
          <v-list-item-subtitle>
            <v-chip
              v-for="group in mediaItem.release_groups"
              :key="group"
              size="x-small"
              class="mr-1 mt-1"
              color="primary"
              variant="tonal"
            >
              {{ group }}
            </v-chip>
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="mediaItem.customization?.length" class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >自定义词</v-list-item-title
          >
          <v-list-item-subtitle>
            <v-chip
              v-for="word in mediaItem.customization"
              :key="word"
              size="x-small"
              class="mr-1 mt-1"
              color="primary"
              variant="tonal"
            >
              {{ word }}
            </v-chip>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>
<script lang="ts" setup name="ResourceInfo">
import { defineProps } from "vue";
import type { MediaItem } from "@/types";
const props = defineProps<{
  mediaItem: MediaItem;
}>();
</script>
