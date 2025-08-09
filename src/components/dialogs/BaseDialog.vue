<template>
  <v-dialog
    v-model="localVisible"
    :max-width="maxWidth"
    :scrollable="scrollable"
    :persistent="persistent"
    :retain-focus="false"
  >
    <v-card>
      <!-- 标题栏 -->
      <v-card-title v-if="showTitle" class="d-flex align-center">
        <slot name="title">
          <span>{{ title }}</span>
        </slot>
        <v-spacer />
        <slot name="title-actions">
          <v-btn
            v-if="showCloseButton"
            icon="mdi-close"
            variant="text"
            size="small"
            @click="handleClose"
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

<script lang="ts" setup>
import { computed } from "vue";

interface Props {
  visible: boolean; // 是否可见
  title?: string; // 标题
  maxWidth?: number; // 最大宽度
  scrollable?: boolean; // 是否可滚动
  persistent?: boolean; // 是否持久化

  // 标题栏
  showTitle?: boolean;
  showCloseButton?: boolean;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "close"): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  maxWidth: 600,
  scrollable: false,
  persistent: false,

  showTitle: true,
  showCloseButton: true,
});

const emit = defineEmits<Emits>();

// 双向绑定visible属性
const localVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit("update:visible", value),
});

// 事件处理
const handleClose = () => {
  localVisible.value = false;
  emit("close");
};
</script>
