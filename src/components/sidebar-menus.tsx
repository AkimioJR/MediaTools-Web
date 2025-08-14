import { Listbox, ListboxItem } from '@heroui/listbox'
import { useLocation, useNavigate } from 'react-router-dom'

import { cn } from '@/utils'
import { siteConfig } from '@/config/site'

export function SidebarMenus() {
  const { navMenuItems } = siteConfig
  const navigate = useNavigate()
  const location = useLocation()

  const getSelectedKeys = () => {
    const currentPath = location.pathname

    if (currentPath === '/' || currentPath === '') {
      return new Set([navMenuItems[0].href])
    }

    const matchedItem = navMenuItems.find((item) => item.href === currentPath)

    if (matchedItem) {
      return new Set([matchedItem.href])
    }

    return new Set([navMenuItems[0].href])
  }

  // 为不同的菜单项定义彩色样式
  const getIconStyles = (href: string, isSelected: boolean) => {
    const baseStyles =
      'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200'

    switch (href) {
      case '/dashboard':
        return isSelected
          ? `${baseStyles} bg-blue-500 text-white shadow-lg shadow-blue-500/25`
          : `${baseStyles} bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900`
      case '/storage':
        return isSelected
          ? `${baseStyles} bg-green-500 text-white shadow-lg shadow-green-500/25`
          : `${baseStyles} bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900`
      case '/settings':
        return isSelected
          ? `${baseStyles} bg-purple-500 text-white shadow-lg shadow-purple-500/25`
          : `${baseStyles} bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900`
      default:
        return isSelected
          ? `${baseStyles} bg-primary text-white shadow-lg`
          : `${baseStyles} bg-default-100 text-default-600 hover:bg-default-200`
    }
  }

  return (
    <Listbox
      aria-label="Navigation Menu"
      selectionMode="single"
      variant="flat"
      onAction={(key) => navigate(key as string)}
    >
      {navMenuItems.map((item) => {
        const isSelected = getSelectedKeys().has(item.href)

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
}
