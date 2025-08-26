import { Toaster, toast } from 'react-hot-toast'

export type MessageType = 'success' | 'error' | 'warning' | 'info'

// 成功提示
export const showSuccess = (message: string, title?: string) => {
  const fullMessage = title ? `${title}: ${message}` : message

  toast.success(fullMessage)
}

// 错误提示
export const showError = (message: string, title?: string) => {
  const fullMessage = title ? `${title}: ${message}` : message

  toast.error(fullMessage)
}

// 警告提示
export const showWarning = (message: string, title?: string) => {
  const fullMessage = title ? `${title}: ${message}` : message

  toast(fullMessage, {
    icon: '⚠️',
  })
}

// 信息提示
export const showInfo = (message: string, title?: string) => {
  const fullMessage = title ? `${title}: ${message}` : message

  toast(fullMessage, {
    icon: 'ℹ️',
  })
}

// 处理API错误
export const handleApiError = (error: unknown, defaultMessage = '操作失败') => {
  let message = defaultMessage

  if (error instanceof Error) {
    message = error.message
  } else if (typeof error === 'string') {
    message = error
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String((error as any).message)
  }

  showError(message)
}

// Toast 提供者组件
export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        style: {
          maxWidth: '500px',
          whiteSpace: 'break-spaces',
        },
      }}
    />
  )
}
