import type { LogLevel } from '@/types'

// 日志级别选项
export const LOG_LEVELS: { label: string; value: LogLevel }[] = [
  { label: 'Debug', value: 'debug' },
  { label: 'Info', value: 'info' },
  { label: 'Warning', value: 'warn' },
  { label: 'Error', value: 'error' },
]

// 传输类型选项
export const TRANSFER_TYPE_OPTIONS = [
  { label: '复制', value: 'Copy' },
  { label: '移动', value: 'Move' },
  { label: '硬链接', value: 'Link' },
  { label: '软链接', value: 'SoftLink' },
] as const

// 通用样式类名
export const SETTINGS_STYLES = {
  container: 'space-y-6 sm:space-y-8',
  grid: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  emptyState: 'text-center py-8 text-foreground-500',
} as const
