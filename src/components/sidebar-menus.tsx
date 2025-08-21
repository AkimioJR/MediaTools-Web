import { Listbox, ListboxItem } from '@heroui/listbox'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo, memo } from 'react'

import { cn } from '@/utils'
import { siteConfig } from '@/config/site'
import { MenuIcon } from '@/components/icon'
import { getMenuIconClass } from '@/utils/iconStyles'

interface SidebarMenusProps {
  onItemClick?: () => void
}

export const SidebarMenus = memo(function SidebarMenus({
  onItemClick,
}: SidebarMenusProps) {
  const { navMenuItems } = siteConfig
  const navigate = useNavigate()
  const location = useLocation()

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

  const getIconStyles = (href: string, isSelected: boolean) => {
    const pathKey = href.replace('/', '') || 'dashboard'

    return getMenuIconClass(pathKey, isSelected)
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
                <MenuIcon icon={item.icon} />
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
