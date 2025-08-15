import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar'
import { Button } from '@heroui/button'
import { PanelRightOpen, PanelRightClose, Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'

import { ThemeSwitch } from '@/components/theme-switch'
import { useAppStore } from '@/stores/useAppStore'
import { siteConfig } from '@/config/site'

export function NavBar() {
  const { switchSidebar, isOpenSidebar, switchMobileDrawer } = useAppStore()
  const location = useLocation()

  // 使用 useMemo 缓存当前菜单项和页面标题
  const { currentMenuItem, pageTitle } = useMemo(() => {
    const currentMenuItem = siteConfig.navMenuItems.find(
      (item) => item.href === location.pathname,
    )
    const pageTitle = currentMenuItem?.label || siteConfig.navMenuItems[0].label

    return { currentMenuItem, pageTitle }
  }, [location.pathname])

  return (
    <Navbar isBordered className="" maxWidth="full" position="sticky">
      <NavbarBrand>
        {/* 移动端菜单按钮 */}
        <Button
          isIconOnly
          className="mr-2 md:hidden"
          size="sm"
          variant="light"
          onPress={switchMobileDrawer}
        >
          <Menu className="w-4 h-4" />
        </Button>

        {/* PC端侧边栏切换按钮 */}
        <Button
          isIconOnly
          className="mr-2 hidden md:flex"
          size="sm"
          variant="light"
          onPress={switchSidebar}
        >
          {isOpenSidebar ? <PanelRightOpen /> : <PanelRightClose />}
        </Button>

        <NavbarItem className="flex items-center gap-2">
          <span className="font-semibold text-base sm:text-lg truncate">
            {pageTitle}
          </span>
        </NavbarItem>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
