/**
 * 图标样式常量
 * 提供预定义的图标 className 组合，确保整个应用图标样式的一致性
 */

// 基础尺寸类
export const ICON_SIZES = {
  xs: 'w-3 h-3', // 12px - 小按钮
  sm: 'w-4 h-4', // 16px - 按钮
  md: 'w-5 h-5', // 20px - 默认
  lg: 'w-6 h-6', // 24px - 大图标
  xl: 'w-8 h-8', // 32px - 超大图标
} as const

// 基础颜色类
export const ICON_COLORS = {
  default: 'text-default-600',
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  muted: 'text-foreground-400',
} as const

// 预设组合样式
export const ICON_STYLES = {
  // Header 区域统一样式
  HEADER: 'w-5 h-5 text-default-600',

  // 按钮内图标（继承颜色）
  BUTTON: 'w-4 h-4',
  BUTTON_SMALL: 'w-3 h-3',
  BUTTON_LARGE: 'w-5 h-5',

  // 菜单图标
  MENU: 'w-5 h-5',

  // 文件类型图标
  FILE_FOLDER: 'w-5 h-5 text-amber-500',
  FILE_DEFAULT: 'w-5 h-5 text-gray-500',

  // 状态图标
  STATUS_SUCCESS: 'w-5 h-5 text-success',
  STATUS_WARNING: 'w-5 h-5 text-warning',
  STATUS_ERROR: 'w-5 h-5 text-danger',
  STATUS_INFO: 'w-5 h-5 text-primary',
} as const

// 导出类型
export type IconSize = keyof typeof ICON_SIZES
export type IconColor = keyof typeof ICON_COLORS
export type IconStyleKey = keyof typeof ICON_STYLES
