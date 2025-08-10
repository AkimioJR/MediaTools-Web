<template>
  <!-- 简介内容 -->
  <div v-if="!isLoading && overview && !errMsg" class="pa-4">
    {{ overview }}
  </div>

  <!-- 加载中 -->
  <div v-else-if="isLoading" class="d-flex align-center justify-center pa-8">
    <v-progress-circular indeterminate color="primary" size="40" class="mr-3" />
    <span class="text-body-1">正在获取简介...</span>
  </div>

  <!-- 简介错误 -->
  <v-alert v-else-if="errMsg" type="error" variant="tonal" class="mb-0">
    <template #title>获取简介失败</template>
    {{ errMsg }}
  </v-alert>

  <!-- 无简介 -->
  <v-alert v-else type="info" variant="tonal" class="mb-0">
    <template #title>暂无简介</template>
    该媒体暂时没有可用的简介信息
  </v-alert>
</template>

<script lang="ts" setup name="OverView">
import { ref, defineProps, watchEffect } from "vue";

import type { MediaItem } from "@/types";
import { TMDBService } from "@/services";

const props = defineProps<{
  mediaItem: MediaItem;
}>();

const isLoading = ref(true);
const overview = ref("");
const errMsg = ref("");

async function loadOverview() {
  console.log("开始加载简介:", props.mediaItem.tmdb_id);
  isLoading.value = true;
  try {
    overview.value = await TMDBService.GetOverview(
      props.mediaItem.media_type,
      props.mediaItem.tmdb_id
    );
    errMsg.value = "";
    console.log("简介加载成功:", overview.value);
  } catch (error) {
    errMsg.value = "获取简介失败: " + (error as Error).message;
    console.error("获取简介失败:", error);
  } finally {
    isLoading.value = false;
  }
}
watchEffect(loadOverview);
</script>
