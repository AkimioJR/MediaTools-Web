import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar'
import { Button } from '@heroui/button'
import { PanelRightOpen, PanelRightClose, Menu, ScanSearch } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'

import { HeaderIcon } from '@/components/icon'
import { ThemeSwitch } from '@/components/theme-switch'
import { MediaRecognitionDialog } from '@/components/media-recognition-dialog'
import { useModal } from '@/components/modal-provider'
import { useAppStore } from '@/stores/useAppStore'
import { siteConfig } from '@/config/site'
import { TaskList } from '@/ui/nav_bar/TaskList'

export function NavBar() {
  const { switchSidebar, isOpenSidebar, switchMobileDrawer } = useAppStore()
  const { openModal } = useModal()
  const location = useLocation()

  const pageTitle = useMemo(() => {
    const currentMenuItem = siteConfig.navMenuItems.find(
      (item) => item.href === location.pathname,
    )

    return currentMenuItem?.label || siteConfig.navMenuItems[0].label
  }, [location.pathname])

  const handleOpenMediaRecognition = async () => {
    await openModal(() => <MediaRecognitionDialog defaultValue="" />, {
      title: '媒体识别',
      size: window.innerWidth < 768 ? '3xl' : '4xl',
    })
  }

  return (
    <Navbar
      isBordered
      className=""
      maxWidth="full"
      position="sticky"
      style={{ '--wails-draggable': 'drag', cursor: 'default' }}
    >
      <NavbarBrand>
        {/* 移动端菜单按钮 */}
        <Button
          isIconOnly
          className="mr-2 md:hidden"
          size="sm"
          variant="light"
          onPress={switchMobileDrawer}
        >
          <HeaderIcon icon={Menu} />
        </Button>

        {/* PC端侧边栏切换按钮 */}
        <Button
          isIconOnly
          className="mr-2 hidden md:flex"
          size="sm"
          variant="light"
          onPress={switchSidebar}
        >
          {isOpenSidebar ? (
            <HeaderIcon icon={PanelRightOpen} />
          ) : (
            <HeaderIcon icon={PanelRightClose} />
          )}
        </Button>

        <NavbarItem className="flex items-center gap-2">
          <span className="font-semibold text-base sm:text-lg truncate">
            {pageTitle}
          </span>
        </NavbarItem>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <TaskList />
        </NavbarItem>
        <NavbarItem>
          <Button
            isIconOnly
            aria-label="媒体识别"
            size="sm"
            variant="light"
            onPress={handleOpenMediaRecognition}
          >
            <HeaderIcon icon={ScanSearch} />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
