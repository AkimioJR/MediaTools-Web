import { ref, reactive } from "vue";

// 弹窗类型枚举
export enum DialogType {
  MEDIA_RECOGNITION = "media-recognition", // 识别媒体弹窗
  LOG = "log", // 日志弹窗
}

// 弹窗配置接口
export interface DialogConfig {
  type: DialogType; // 弹窗类型
  visible: boolean; // 弹窗是否可见
  props?: Record<string, any>; // 弹窗属性
  data?: any; // 弹窗数据
}

// 弹窗事件处理器类型
export interface DialogEventHandlers {
  onOpen?: () => void; // 打开事件处理器
  onSuccess?: (data: any) => void; // 成功事件处理器（点击了“确定”或“提交”）
  onClose?: () => void; // 关闭事件处理器（点击关闭按钮）
}

// 全局状态 - 在模块级别创建，确保所有组件共享同一个实例
const globalActiveDialog = ref<DialogConfig | null>(null);
const globalEventHandlers = reactive<DialogEventHandlers>({});

// 全局弹窗管理 Hook
export function useGlobalDialogs() {
  /**
   * 打开弹窗
   * @param type 弹窗类型
   * @param props 弹窗属性
   * @param handlers 事件处理器
   */
  const openDialog = (
    type: DialogType,
    props?: Record<string, any>,
    handlers?: DialogEventHandlers
  ) => {
    globalActiveDialog.value = {
      type,
      visible: true,
      props: props || {},
    };

    // 设置事件处理器
    Object.assign(globalEventHandlers, handlers || {});
  };

  /**
   * 关闭弹窗
   */
  const closeDialog = () => {
    if (globalActiveDialog.value) {
      globalActiveDialog.value.visible = false;
      globalActiveDialog.value = null;
    }

    // 清空事件处理器
    globalEventHandlers.onOpen = undefined;
    globalEventHandlers.onSuccess = undefined;
    globalEventHandlers.onClose = undefined;
  };

  /**
   * 处理弹窗打开事件
   * 当弹窗被打开时，应该调用这个方法
   */
  const handleDialogOpen = () => {
    if (globalEventHandlers.onOpen) {
      globalEventHandlers.onOpen();
    }
  };

  /**
   * 处理弹窗成功事件
   * 点击了“确定”或“提交”，在这种情况下，弹窗应该关闭，并且相关的事件处理器应该被调用
   */
  const handleDialogSuccess = (data: any) => {
    if (globalEventHandlers.onSuccess) {
      globalEventHandlers.onSuccess(data);
    }
    closeDialog();
  };

  /**
   * 处理弹窗关闭事件
   * 点击关闭按钮或其他方式关闭弹窗时，应该调用这个方法
   */
  const handleDialogClose = () => {
    if (globalEventHandlers.onClose) {
      globalEventHandlers.onClose();
    }
    closeDialog();
  };

  return {
    // 状态
    activeDialog: globalActiveDialog, // 当前活动的弹窗配置

    // 通用方法
    closeDialog, // 关闭弹窗
    handleDialogOpen, // 处理弹窗打开事件
    handleDialogSuccess, // 处理弹窗成功事件
    handleDialogClose, // 处理弹窗关闭事件

    // 特定弹窗方法
    openMediaRecognitionDialog() {
      openDialog(DialogType.MEDIA_RECOGNITION, {}, {});
    },
    openLogDialog() {
      openDialog(DialogType.LOG, {}, {});
    },
  };
}
