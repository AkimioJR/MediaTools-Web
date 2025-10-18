import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/layouts/sidebar'
import { NavBar } from '@/layouts/nav-bar'
import { MobileDrawer } from '@/components/mobile-drawer'
import { cn } from '@/utils'
import { useAppStore } from '@/stores/useAppStore'

export default function HomeLayout() {
  const { isOpenSidebar } = useAppStore()

  return (
    <div className="relative h-screen overflow-hidden">
      <Sidebar />
      <MobileDrawer />
      <main
        className={cn(
          'h-full transition-all duration-300 ease-in-out overflow-y-auto bg-background',
          isOpenSidebar ? 'md:ml-64' : 'md:ml-0',
        )}
      >
        <NavBar />
        <Outlet />
      </main>
    </div>
  )
}
