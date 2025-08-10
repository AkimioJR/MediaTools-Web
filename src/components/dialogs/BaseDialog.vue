<template>
  <v-dialog
    :model-value="visible"
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

<script lang="ts" setup name="BaseDialog">
interface Props {
  visible: boolean; // 是否可见
  title?: string; // 标题
  maxWidth?: number | string; // 最大宽度
  scrollable?: boolean; // 是否可滚动
  persistent?: boolean; // 是否持久化
  closeFunction?: () => void; // 关闭回调函数
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  maxWidth: "auto",
  scrollable: false,
  persistent: false,

  showTitle: true,
  showCloseButton: true,
});

// 当对话框关闭时，自动更新 visible 状态
function handleClose() {
  if (props.closeFunction) {
    props.closeFunction();
  }
}
</script>
