<template>
  <BaseDialog
    v-model:visible="dialogVisible"
    title="媒体识别"
    max-width="800"
    :close-function="closeFunction"
  >
    <!-- 输入区域 -->
    <div class="d-flex align-center gap-3">
      <v-text-field
        v-model="mediaTitle"
        label="请输入媒体名称"
        placeholder="例如：[Haruhana] Kaoru Hana wa Rin to Saku - 05 [WebRip][HEVC-10bit 1080p][CHI_JPN].mkv"
        :loading="isLoading"
        :disabled="isLoading"
        variant="outlined"
        clearable
        class="flex-grow-1"
        density="default"
        @keyup.enter="handleRecognize"
        @clear="mediaTitle = ''"
      />
      <v-btn
        color="primary"
        :loading="isLoading"
        :disabled="!mediaTitle?.trim()"
        class="recognize-btn"
        @click="handleRecognize"
      >
        {{ result ? "重新识别" : "开始识别" }}
      </v-btn>
    </div>

    <!-- 识别结果区域 -->
    <MediaDetail
      v-if="result || errMsg"
      :mediaItem="result"
      :errMsg="errMsg"
      class="mt-4"
    />
  </BaseDialog>
</template>

<script lang="ts" setup name="MediaRecognitionDialog">
import BaseDialog from "./BaseDialog.vue";
import MediaDetail from "@/components/MediaDetail/index.vue";

import { defineProps, ref, defineEmits, computed } from "vue";
import type { MediaItem } from "@/types";
import { MediaService } from "@/services";
import { type DialogEmit } from "@/hooks";

const props = defineProps<{
  visible: boolean; // 是否可见
}>();
const emit = defineEmits<DialogEmit>();

const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit("update:visible", value),
});

const mediaTitle = ref("");
const isLoading = ref(false);
const result = ref<MediaItem | null>(null);
const errMsg = ref<string | null>(null);

async function handleRecognize() {
  isLoading.value = true;
  result.value = null;

  try {
    result.value = await MediaService.Recognize(mediaTitle.value);
  } catch (error) {
    result.value = null;
    errMsg.value = (error as Error).message;
    console.error((error as Error).message);
  } finally {
    isLoading.value = false;
  }
}

function closeFunction() {
  emit("update:visible", false);
}
</script>
