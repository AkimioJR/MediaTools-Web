/**
 * 媒体相关工具函数
 */

/**
 * 获取媒体类型文本
 * @param type 媒体类型
 * @returns 媒体类型的中文描述
 */
export const getMediaTypeText = (type: string | number): string => {
  const typeMap: Record<string | number, string> = {
    1: '电影',
    2: '电视剧',
    movie: '电影',
    tv: '电视剧',
    series: '电视剧',
  }

  return typeMap[type] || String(type)
}

/**
 * 提取错误信息
 * @param error 错误对象
 * @returns 格式化的错误信息
 */
export const extractErrorMessage = (error: unknown): string => {
  const defaultMessage = '识别媒体失败，请稍后重试'

  if (!error || typeof error !== 'object') {
    return defaultMessage
  }

  const errorObj = error as any

  // 检查是否有 response.data.message (Axios HTTP 错误)
  if (errorObj.response?.data?.message) {
    return errorObj.response.data.message
  }

  // 检查是否有 message 属性 (通用错误对象)
  if (errorObj.message) {
    return errorObj.message
  }

  // 检查是否有 data.message (其他数据格式)
  if (errorObj.data?.message) {
    return errorObj.data.message
  }

  return defaultMessage
}

/**
 * 验证媒体标题输入
 * @param title 媒体标题
 * @returns 验证结果
 */
export const validateMediaTitle = (
  title: string | null | undefined,
): {
  isValid: boolean
  errorMessage?: string
} => {
  if (!title) {
    return {
      isValid: false,
      errorMessage: '请输入媒体名称',
    }
  }

  const trimmedTitle = title.trim()

  if (!trimmedTitle) {
    return {
      isValid: false,
      errorMessage: '请输入媒体名称',
    }
  }

  return { isValid: true }
}
