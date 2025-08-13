import { Listbox, ListboxItem } from '@heroui/listbox'
import { useLocation, useNavigate } from 'react-router-dom'

import { siteConfig } from '@/config/site'
import { cn } from '@/utils'

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
            className={cn(isSelected && 'bg-default-100 font-medium')}
            href={item.href}
            startContent={<item.icon className="size-7 mr-3" />}
          >
            {item.label}
          </ListboxItem>
        )
      })}
    </Listbox>
  )
}
