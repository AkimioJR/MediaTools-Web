import { Listbox, ListboxItem } from '@heroui/listbox'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo, memo } from 'react'

import { cn } from '@/utils'
import { siteConfig } from '@/config/site'

interface SidebarMenusProps {
  onItemClick?: () => void
}

export const SidebarMenus = memo(function SidebarMenus({
  onItemClick,
}: SidebarMenusProps) {
  const { navMenuItems } = siteConfig
  const navigate = useNavigate()
  const location = useLocation()

  // 使用 useMemo 缓存选中的键
  const selectedKeys = useMemo(() => {
    const currentPath = location.pathname

    if (currentPath === '/' || currentPath === '') {
      return new Set([navMenuItems[0].href])
    }

    const matchedItem = navMenuItems.find((item) => item.href === currentPath)

    if (matchedItem) {
      return new Set([matchedItem.href])
    }

    return new Set([navMenuItems[0].href])
  }, [location.pathname, navMenuItems])

  // 使用 useMemo 缓存样式映射
  const iconStylesMap = useMemo(() => {
    const baseStyles =
      'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200'

    return {
      dashboard: {
        selected: `${baseStyles} bg-blue-500 text-white shadow-lg shadow-blue-500/25`,
        default: `${baseStyles} bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900`,
      },
      storage: {
        selected: `${baseStyles} bg-green-500 text-white shadow-lg shadow-green-500/25`,
        default: `${baseStyles} bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900`,
      },
      settings: {
        selected: `${baseStyles} bg-purple-500 text-white shadow-lg shadow-purple-500/25`,
        default: `${baseStyles} bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900`,
      },
      default: {
        selected: `${baseStyles} bg-primary text-white shadow-lg`,
        default: `${baseStyles} bg-default-100 text-default-600 hover:bg-default-200`,
      },
    }
  }, [])

  // 获取图标样式的优化函数
  const getIconStyles = (href: string, isSelected: boolean) => {
    const pathKey = href.replace('/', '') || 'dashboard'
    const styleKey = isSelected ? 'selected' : 'default'

    return (
      iconStylesMap[pathKey as keyof typeof iconStylesMap]?.[styleKey] ||
      iconStylesMap.default[styleKey]
    )
  }

  const handleItemClick = (key: React.Key) => {
    navigate(key as string)
    onItemClick?.()
  }

  return (
    <Listbox
      aria-label="Navigation Menu"
      selectionMode="single"
      variant="flat"
      onAction={handleItemClick}
    >
      {navMenuItems.map((item) => {
        const isSelected = selectedKeys.has(item.href)

        return (
          <ListboxItem
            key={item.href}
            className={cn(isSelected && 'bg-default/40')}
            href={item.href}
            startContent={
              <div className={getIconStyles(item.href, isSelected)}>
                <item.icon className="w-5 h-5" />
              </div>
            }
          >
            {item.label}
          </ListboxItem>
        )
      })}
    </Listbox>
  )
})
