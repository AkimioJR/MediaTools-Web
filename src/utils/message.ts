// import { ref } from 'vue'

// // 消息类型
// export type MessageType = 'success' | 'error' | 'warning' | 'info'

// // 消息状态接口
// export interface MessageState {
//   show: boolean
//   message: string
//   color: MessageType
//   timeout?: number
// }

// // 全局消息状态
// const globalMessage = ref<MessageState>({
//   show: false,
//   message: '',
//   color: 'success',
//   timeout: 4000,
// })

// // 消息工具类
// export class MessageUtil {
//   /**
//    * 显示成功消息
//    * @param message 消息内容
//    * @param timeout 显示时长（毫秒），默认 4000ms
//    */
//   static success(message: string, timeout = 4000) {
//     this.show(message, 'success', timeout)
//   }

//   /**
//    * 显示错误消息
//    * @param message 消息内容
//    * @param timeout 显示时长（毫秒），默认 6000ms
//    */
//   static error(message: string, timeout = 6000) {
//     this.show(message, 'error', timeout)
//   }

//   /**
//    * 显示警告消息
//    * @param message 消息内容
//    * @param timeout 显示时长（毫秒），默认 5000ms
//    */
//   static warning(message: string, timeout = 5000) {
//     this.show(message, 'warning', timeout)
//   }

//   /**
//    * 显示信息消息
//    * @param message 消息内容
//    * @param timeout 显示时长（毫秒），默认 4000ms
//    */
//   static info(message: string, timeout = 4000) {
//     this.show(message, 'info', timeout)
//   }

//   /**
//    * 显示消息
//    * @param message 消息内容
//    * @param type 消息类型
//    * @param timeout 显示时长（毫秒）
//    */
//   static show(message: string, type: MessageType = 'success', timeout = 4000) {
//     globalMessage.value = {
//       show: true,
//       message,
//       color: type,
//       timeout,
//     }
//   }

//   /**
//    * 隐藏消息
//    */
//   static hide() {
//     globalMessage.value.show = false
//   }

//   /**
//    * 处理 API 错误
//    * @param error 错误对象
//    * @param defaultMessage 默认错误消息
//    */
//   static handleApiError(error: unknown, defaultMessage = '操作失败') {
//     let message = defaultMessage

//     if (error instanceof Error) {
//       message = error.message
//     } else if (typeof error === 'string') {
//       message = error
//     } else if (error && typeof error === 'object' && 'message' in error) {
//       message = String((error as any).message)
//     }

//     this.error(message)
//   }

//   /**
//    * 获取全局消息状态（用于组件中）
//    */
//   static getMessageState() {
//     return globalMessage
//   }
// }

// // 导出便捷函数
// export const showSuccess = MessageUtil.success.bind(MessageUtil)
// export const showError = MessageUtil.error.bind(MessageUtil)
// export const showWarning = MessageUtil.warning.bind(MessageUtil)
// export const showInfo = MessageUtil.info.bind(MessageUtil)
// export const handleApiError = MessageUtil.handleApiError.bind(MessageUtil)
// export const hideMessage = MessageUtil.hide.bind(MessageUtil)

// // 导出全局消息状态
// export const globalMessageState = globalMessage
