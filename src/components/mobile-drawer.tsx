import { Drawer, DrawerContent } from '@heroui/drawer'
import { Wand2 } from 'lucide-react'
import { memo } from 'react'

import { useAppStore } from '@/stores/useAppStore'
import { SidebarMenus } from '@/components/sidebar-menus'
import { Icon } from '@/components/icon'

export const MobileDrawer = memo(function MobileDrawer() {
  const { isOpenMobileDrawer, closeMobileDrawer } = useAppStore()

  return (
    <Drawer
      backdrop="blur"
      className="max-w-60"
      isOpen={isOpenMobileDrawer}
      placement="left"
      radius="none"
      size="xs"
      onClose={closeMobileDrawer}
    >
      <DrawerContent>
        <div className="flex h-full flex-col px-2">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                <Icon icon={Wand2} size="md" color="inherit" />
              </div>
              <div>
                <h2 className="font-semibold">MediaTools</h2>
                <p className="text-xs">v0.0.1</p>
              </div>
            </div>
          </div>
          <div className="flex-1 px-2">
            <SidebarMenus onItemClick={closeMobileDrawer} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
})
