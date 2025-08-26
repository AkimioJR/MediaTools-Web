export type SiteConfig = typeof siteConfig
import { Gauge, DatabaseZap, Cog, FolderClock } from 'lucide-react'

export const siteConfig = {
  name: 'MediaTools',
  description: 'MediaTools',
  navMenuItems: [
    {
      label: '仪表盘',
      href: '/dashboard',
      icon: Gauge,
      styleSelected:
        'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 bg-blue-500 text-white shadow-lg shadow-blue-500/25',
      styleDefault:
        'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900',
    },
    {
      label: '存储管理',
      href: '/storage',
      icon: DatabaseZap,
      styleSelected:
        'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 bg-green-500 text-white shadow-lg shadow-green-500/25',
      styleDefault:
        'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900',
    },
    {
      label: '转移历史记录',
      href: '/history',
      icon: FolderClock,
      styleSelected:
        'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 bg-yellow-500 text-white shadow-lg shadow-yellow-500/25',
      styleDefault:
        'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900',
    },
    {
      label: '系统设置',
      href: '/settings',
      icon: Cog,
      styleSelected:
        'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 bg-purple-500 text-white shadow-lg shadow-purple-500/25',
      styleDefault:
        'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900',
    },
  ],
  ui: {
    iconBadgeDefaultSelected:
      'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 bg-primary text-white shadow-lg',
    iconBadgeDefault:
      'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 bg-default-100 text-default-600 hover:bg-default-200',
  },
}

export function getMenuIconClass(kind: string, selected: boolean): string {
  const keyPath = kind.startsWith('/') ? kind : `/${kind || 'dashboard'}`
  const item = siteConfig.navMenuItems.find((i) => i.href === keyPath)
  const selectedClass =
    item?.styleSelected || siteConfig.ui.iconBadgeDefaultSelected
  const defaultClass = item?.styleDefault || siteConfig.ui.iconBadgeDefault

  return selected ? selectedClass : defaultClass
}
