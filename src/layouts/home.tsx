import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/layouts/sidebar'
import { NavBar } from '@/layouts/nav-bar'
import { cn } from '@/utils'
import { useAppStore } from '@/stores/useAppStore'

export default function HomeLayout() {
  const { isOpenSidebar } = useAppStore()

  return (
    <div className="relative h-screen overflow-hidden bg-background">
      <Sidebar />
      <main
        className={cn(
          'max-h-screen transition-all duration-300 ease-in-out overflow-y-auto bg-background',
          isOpenSidebar ? 'md:pl-64' : 'md:pl-0',
        )}
      >
        <NavBar />
        <div className="bg-content2/20">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
