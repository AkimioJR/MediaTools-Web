import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar'
import { Button } from '@heroui/button'
import { PanelRightOpen, PanelRightClose } from 'lucide-react'
import { useLocation } from 'react-router-dom'

import { ThemeSwitch } from '@/components/theme-switch'
import { useAppStore } from '@/stores/useAppStore'
import { siteConfig } from '@/config/site'

export function NavBar() {
  const { switchSidebar, isOpenSidebar } = useAppStore()
  const location = useLocation()

  const currentMenuItem = siteConfig.navMenuItems.find(
    (item) => item.href === location.pathname,
  )

  const pageTitle = currentMenuItem?.label || siteConfig.navMenuItems[0].label

  return (
    <Navbar isBordered maxWidth="full" position="sticky">
      <NavbarBrand>
        <Button
          isIconOnly
          className="mr-2"
          variant="light"
          onPress={switchSidebar}
        >
          {isOpenSidebar ? <PanelRightOpen /> : <PanelRightClose />}
        </Button>
        <NavbarItem className="flex items-center gap-2">
          <span className="font-semibold text-lg">{pageTitle}</span>
        </NavbarItem>
      </NavbarBrand>

      <NavbarContent className="flex" />

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
