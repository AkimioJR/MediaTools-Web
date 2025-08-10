<template>
  <v-row dense>
    <v-col cols="12" sm="6">
      <v-list density="compact" class="pa-0">
        <v-list-item class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >标题</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">{{
            mediaItem.title
          }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >原始标题</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">{{
            mediaItem.original_title
          }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >年份</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">{{
            mediaItem.year
          }}</v-list-item-subtitle>
        </v-list-item>
        <v-list-item class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >媒体类型</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">{{
            mediaItem.media_type
          }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col cols="12" sm="6">
      <v-list density="compact" class="pa-0">
        <v-list-item class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >TMDB ID</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">
            <a
              :href="`https://www.themoviedb.org/${isTV ? 'tv' : 'movie'}/${
                mediaItem.tmdb_id
              }`"
              target="_blank"
              class="text-decoration-none text-primary"
              @click.stop
              >{{ mediaItem.tmdb_id }}
            </a>
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="mediaItem.imdb_id" class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >IMDB ID</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">
            <a
              :href="`https://www.imdb.com/title/${mediaItem.imdb_id}`"
              target="_blank"
              class="text-decoration-none text-primary"
              @click.stop
              >{{ mediaItem.imdb_id }}
            </a>
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="mediaItem.tvdb_id" class="px-0 py-1">
          <v-list-item-title class="text-caption font-weight-bold"
            >TVDB ID</v-list-item-title
          >
          <v-list-item-subtitle class="text-body-2">
            <a
              :href="`https://thetvdb.com/?tab=series&id=${mediaItem.tvdb_id}`"
              target="_blank"
              class="text-decoration-none text-primary"
              @click.stop
            >
              {{ mediaItem.tvdb_id }}
            </a>
          </v-list-item-subtitle>
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
  isTV: boolean;
}>();
</script>
