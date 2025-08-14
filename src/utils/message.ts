/**
 * 消息提示工具类
 * 基于 react-hot-toast 封装的消息提示功能
 */

// 重新导出 toast 组件的函数，保持API一致性
export {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  handleApiError,
  type MessageType,
} from '@/components/toast-provider'
