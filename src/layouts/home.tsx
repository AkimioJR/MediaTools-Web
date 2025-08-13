import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/layouts/sidebar'
import { NavBar } from '@/layouts/nav-bar'
import { cn } from '@/utils'
import { useAppStore } from '@/stores/useAppStore'

export default function HomeLayout() {
  const { isOpenSidebar } = useAppStore()

  return (
    <div className="relative h-screen overflow-hidden">
      <Sidebar />
      <main
        className={cn(
          'max-h-screen transition-all duration-300 ease-in-out overflow-y-auto',
          isOpenSidebar ? 'md:pl-64' : 'md:pl-0',
        )}
      >
        <NavBar />
        <Outlet />
      </main>
    </div>
  )
}
