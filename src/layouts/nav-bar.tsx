import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar'
import { Link } from '@heroui/link'
import { Button } from '@heroui/button'
import { PanelRightOpen, PanelRightClose } from 'lucide-react'

import { ThemeSwitch } from '@/components/theme-switch'
import { useAppStore } from '@/stores/useAppStore'

export function NavBar() {
  const { switchSidebar, isOpenSidebar } = useAppStore()

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
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            xxxx
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link aria-current="page" href="#">
            xxxx
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            xxxxx
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
