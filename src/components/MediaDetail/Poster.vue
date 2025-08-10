<template>
  <v-col cols="12" md="3" class="d-flex justify-center">
    <div class="poster-container">
      <v-img
        v-if="imgURL"
        :src="imgURL"
        :alt="`${mediaItem.title} Poster`"
        aspect-ratio="2/3"
        cover
        class="poster-image"
      />

      <!-- 海报加载中 -->
      <v-card
        v-else-if="isLoading"
        class="poster-placeholder d-flex align-center justify-center rounded"
        height="300"
        variant="outlined"
      >
        <v-progress-circular indeterminate color="primary" size="40" />
      </v-card>

      <!-- 海报加载失败或无海报 -->
      <v-card
        v-else
        class="poster-placeholder d-flex flex-column align-center justify-center rounded"
        height="300"
        variant="outlined"
      >
        <v-icon size="60" color="grey-lighten-1" class="mb-2">
          mdi-image-off
        </v-icon>
        <span class="text-caption text-grey">
          {{ errMsg }}
        </span>
      </v-card>
    </div>
  </v-col>
</template>

<script lang="ts" setup name="Poster">
import { defineProps, watchEffect, ref, onMounted } from "vue";

import { TMDBService } from "@/services";
import type { MediaItem } from "@/types";

const props = defineProps<{
  mediaItem: MediaItem;
}>();
const imgURL = ref("");
const isLoading = ref(true);
const errMsg = ref("");

async function loadPoster() {
  if (!props.mediaItem.tmdb_id) {
    console.log("无效的媒体项", props.mediaItem);
    isLoading.value = false;
    errMsg.value = "无TMDB ID";
    return;
  }

  console.log("开始加载海报:", props.mediaItem.tmdb_id);
  isLoading.value = true;
  errMsg.value = "";
  imgURL.value = "";

  try {
    const url = await TMDBService.ImageService.GetPosterImage(
      props.mediaItem.media_type,
      props.mediaItem.tmdb_id
    );

    if (url) {
      imgURL.value = url;
    } else {
      errMsg.value = "未找到海报";
    }
  } catch (error) {
    errMsg.value = "海报加载失败: " + (error as Error).message;
    imgURL.value = "";
  } finally {
    isLoading.value = false;
    console.log("海报加载完成:", imgURL.value || "无海报");
  }
}

watchEffect(() => {
  loadPoster();
});
</script>

<style scoped>
.poster-container {
  width: 100%;
  max-width: 300px;
}

.poster-image {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease-in-out;
}

.poster-image:hover {
  transform: scale(1.02);
}

.poster-placeholder {
  min-height: 300px;
  border-radius: 8px;
  border: 2px dashed rgba(var(--v-theme-on-surface), 0.12);
  background-color: rgba(var(--v-theme-surface-variant), 0.05);
}

.poster-placeholder .v-icon {
  opacity: 0.6;
}

.poster-placeholder .text-caption {
  max-width: 200px;
  text-align: center;
  word-wrap: break-word;
}

@media (max-width: 960px) {
  .poster-container {
    max-width: 250px;
  }

  .poster-placeholder {
    min-height: 250px;
  }
}
</style>
