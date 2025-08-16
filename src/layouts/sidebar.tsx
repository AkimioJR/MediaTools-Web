import { Wand2 } from 'lucide-react'

import { useAppStore } from '@/stores/useAppStore'
import { cn } from '@/utils/twUtils'
import { SidebarMenus } from '@/components/sidebar-menus'
import { Icon } from '@/components/icon'

export function Sidebar() {
  const { isOpenSidebar } = useAppStore()

  return (
    <section
      className={cn(
        'fixed inset-y-0 left-0 z-50 hidden w-64 transform border-r border-divider bg-background transition-transform duration-300 ease-in-out md:block',
        isOpenSidebar ? 'translate-x-0' : '-translate-x-full',
      )}
    >
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
          <SidebarMenus />
        </div>
      </div>
    </section>
  )
}
