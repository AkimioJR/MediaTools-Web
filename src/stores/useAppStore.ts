import { create } from 'zustand'

import { StorageService } from '@/services/storage'
import { configService } from '@/services/config'
import { LibraryConfig, StorageProviderInterface } from '@/types'

type AppState = {
  isOpenSidebar: boolean
  isDesktopMode: boolean
  isOpenMobileDrawer: boolean
  providers: StorageProviderInterface[]
  mediaLibraries: LibraryConfig[]
  loadProviders: () => Promise<void>
  loadMediaLibraries: () => Promise<void>
  loadAppStatus: () => void
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
  loadAppStatus: () => {
    const isDesktopMode = Boolean(window?.runtime)

    set({ isDesktopMode })
  },
}))
