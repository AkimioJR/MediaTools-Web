<template>
  <v-row dense>
    <v-col cols="12" sm="6">
      <v-list density="compact" class="pa-0">
        <v-list-item v-if="mediaItem.season_str" class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >季数</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">{{
            mediaItem.season_str
          }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="mediaItem.season_year > 0" class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >季年份</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">{{
            mediaItem.season_year
          }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col cols="12" sm="6">
      <v-list density="compact" class="pa-0">
        <v-list-item v-if="mediaItem.episode_str" class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >集数</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">{{
            mediaItem.episode_str
          }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="mediaItem.episode_title" class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >集标题</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">{{
            mediaItem.episode_title
          }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="mediaItem.episode_date" class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >集发布日期</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">{{
            mediaItem.episode_date
          }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>
<script lang="ts" setup name="BaseInfo">
import { defineProps } from "vue";
import type { MediaItem } from "@/types";
const props = defineProps<{
  mediaItem: MediaItem;
}>();
</script>
