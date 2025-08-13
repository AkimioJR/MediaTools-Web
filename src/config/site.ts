export type SiteConfig = typeof siteConfig
import { Gauge, DatabaseZap, Cog } from 'lucide-react'

export const siteConfig = {
  name: 'MediaTools',
  description: 'MediaTools',
  navMenuItems: [
    {
      label: '仪表盘',
      href: '/dashboard',
      icon: Gauge,
    },
    {
      label: '存储管理',
      href: '/storage',
      icon: DatabaseZap,
    },
    {
      label: '系统设置',
      href: '/settings',
      icon: Cog,
    },
  ],
}
