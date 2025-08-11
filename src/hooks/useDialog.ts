import { ref, computed } from "vue";

export function useDialog() {
  const visible = ref(false);

  // 创建一个可以直接用于 v-model 的 computed
  const modelValue = computed({
    get: () => visible.value,
    set: (value: boolean) => {
      visible.value = value;
    },
  });

  return {
    visible: modelValue, // 现在这个可以直接用于 v-model
    show: () => {
      console.log("打开对话框");
      visible.value = true;
    },
    hide: () => {
      console.log("关闭对话框");
      visible.value = false;
    },
    toggle: () => {
      console.log("切换对话框");
      visible.value = !visible.value;
    },
    set: (value: boolean) => {
      console.log("设置对话框可见性为: " + value);
      visible.value = value;
    },
  };
}

export interface DialogEmit {
  "update:visible": [value: boolean];
}
