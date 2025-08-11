<template>
  <v-dialog
    :model-value="visible"
    @update:model-value="handleDialogUpdate"
    :max-width="maxWidth"
    :scrollable="scrollable"
    :persistent="persistent"
    :retain-focus="false"
  >
    <v-card>
      <!-- 标题栏 -->
      <v-card-title class="d-flex align-center">
        <slot v-if="title" name="title">
          <span>{{ title }}</span>
        </slot>
        <v-spacer />
        <slot name="title-actions">
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="handleDialogUpdate(false)"
          />
        </slot>
      </v-card-title>

      <!-- 内容区域 -->
      <v-card-text>
        <slot />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup name="BaseDialog">
import { defineProps, defineEmits, withDefaults } from "vue";
import { type DialogEmit } from "@/hooks";
interface Props {
  visible: boolean; // 是否可见
  title?: string; // 标题
  maxWidth?: number | string; // 最大宽度
  scrollable?: boolean; // 是否可滚动
  persistent?: boolean; // 是否持久化
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  maxWidth: "auto",
  scrollable: false,
  persistent: false,

  showTitle: true,
  showCloseButton: true,
});
const emit = defineEmits<DialogEmit>();

function handleDialogUpdate(visible: boolean) {
  emit("update:visible", visible);
}
</script>
