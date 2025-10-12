import { Wand2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useAppStore } from '@/stores/useAppStore'
import { cn } from '@/utils/twUtils'
import { SidebarMenus } from '@/components/sidebar-menus'
import { Icon } from '@/components/icon'

import { versionService } from '@/services'

export function Sidebar() {
  const { isOpenSidebar } = useAppStore()
  const [appVersion, setAppVersion] = useState<string>('Loading...')

  useEffect(() => {
    const loadVersion = async () => {
      try {
        const versionInfo = await versionService.getVersionInfo()
        setAppVersion(versionInfo.app_version)
      } catch (error) {
        console.error('Failed to load version info:', error)
        setAppVersion('Unknown')
      }
    }

    loadVersion()
  }, [])

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
              <Icon color="inherit" icon={Wand2} size="md" />
            </div>
            <div>
              <h2 className="font-semibold">MediaTools</h2>
              <p className="text-xs">{appVersion}</p>
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
