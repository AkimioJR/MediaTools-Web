import { LucideIcon } from 'lucide-react'

import { cn } from '@/utils'

// 图标尺寸预设
export const iconSizes = {
  xs: 'w-3 h-3', // 12px - 小按钮内图标
  sm: 'w-4 h-4', // 16px - 按钮内图标
  md: 'w-5 h-5', // 20px - 默认图标 (header, 菜单等)
  lg: 'w-6 h-6', // 24px - 大图标
  xl: 'w-8 h-8', // 32px - 超大图标
} as const

// 图标颜色预设
export const iconColors = {
  default: 'text-default-600', // 默认颜色
  primary: 'text-primary', // 主色
  secondary: 'text-secondary', // 次要色
  success: 'text-success', // 成功色
  warning: 'text-warning', // 警告色
  danger: 'text-danger', // 危险色
  muted: 'text-foreground-400', // 静音色
  inherit: '', // 继承父元素颜色
} as const

// 图标常用样式组合
export const iconStyles = {
  // Header 区域图标
  header: `${iconSizes.md} ${iconColors.default}`,

  // 按钮内图标
  button: `${iconSizes.sm} ${iconColors.inherit}`,
  buttonSmall: `${iconSizes.xs} ${iconColors.inherit}`,

  // 菜单图标
  menu: `${iconSizes.md}`,

  // 状态图标
  status: `${iconSizes.md}`,

  // 装饰图标
  decorative: `${iconSizes.md}`,
} as const

export type IconSize = keyof typeof iconSizes
export type IconColor = keyof typeof iconColors
export type IconStyle = keyof typeof iconStyles

// 基础图标组件接口
export interface IconProps {
  /** Lucide 图标组件 */
  icon: LucideIcon
  /** 预设尺寸 */
  size?: IconSize
  /** 预设颜色 */
  color?: IconColor
  /** 预设样式组合 */
  variant?: IconStyle
  /** 自定义类名 */
  className?: string
  /** 其他属性 */
  [key: string]: any
}

/**
 * 通用图标组件
 *
 * @example
 * // 使用预设尺寸和颜色
 * <Icon icon={Menu} size="md" color="default" />
 *
 * // 使用预设样式组合
 * <Icon icon={Search} variant="header" />
 *
 * // 自定义样式
 * <Icon icon={Heart} className="w-6 h-6 text-red-500" />
 */
export function Icon({
  icon: IconComponent,
  size = 'md',
  color = 'default',
  variant,
  className,
  ...props
}: IconProps) {
  const sizeClass = iconSizes[size]
  const colorClass = iconColors[color]

  // 如果使用 variant，优先使用预设样式
  const variantClass = variant
    ? iconStyles[variant]
    : `${sizeClass} ${colorClass}`

  return <IconComponent className={cn(variantClass, className)} {...props} />
}

/**
 * Header 专用图标组件
 * 统一 header 区域图标的样式
 */
export function HeaderIcon({
  icon,
  className,
  ...props
}: Omit<IconProps, 'variant'>) {
  return <Icon className={className} icon={icon} variant="header" {...props} />
}

/**
 * 按钮图标组件
 * 用于按钮内的图标，统一尺寸大小
 */
export function ButtonIcon({
  icon,
  size = 'sm',
  className,
  ...props
}: Omit<IconProps, 'variant' | 'color'>) {
  return (
    <Icon
      className={className}
      color="inherit"
      icon={icon}
      size={size}
      {...props}
    />
  )
}

/**
 * 菜单图标组件
 * 用于菜单项的图标
 */
export function MenuIcon({
  icon,
  className,
  ...props
}: Omit<IconProps, 'variant' | 'size'>) {
  return <Icon className={className} icon={icon} variant="menu" {...props} />
}
