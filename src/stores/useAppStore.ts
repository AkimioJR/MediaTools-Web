import { create } from 'zustand'

import { StorageService, configService, runtimeService } from '@/services'
import { LibraryConfig, StorageProviderInterface } from '@/types'

type AppState = {
  isOpenSidebar: boolean
  isDesktopMode: boolean
  isOpenMobileDrawer: boolean
  providers: StorageProviderInterface[]
  mediaLibraries: LibraryConfig[]
  loadProviders: () => Promise<void>
  loadMediaLibraries: () => Promise<void>
  loadAppStatus: () => Promise<void>
  switchSidebar: () => void
  switchMobileDrawer: () => void
  closeMobileDrawer: () => void
}

export const useAppStore = create<AppState>((set) => ({
  isOpenSidebar: true,
  isDesktopMode: false,
  isOpenMobileDrawer: false,
  providers: [],
  mediaLibraries: [],
  switchSidebar: () => set((s) => ({ isOpenSidebar: !s.isOpenSidebar })),
  switchMobileDrawer: () =>
    set((s) => ({ isOpenMobileDrawer: !s.isOpenMobileDrawer })),
  closeMobileDrawer: () => set({ isOpenMobileDrawer: false }),
  loadProviders: async () =>
    set({ providers: await StorageService.ProviderService.getProviderList() }),
  loadMediaLibraries: async () => {
    set({
      mediaLibraries: await configService.getMediaLibrariesConfig(),
    })
  },
  loadAppStatus: async () => {
    const statusInfo = await runtimeService.getRuntimeAppStatusInfo()
    const isDesktopMode = statusInfo.desktop_mode

    set({ isDesktopMode })
  },
}))
