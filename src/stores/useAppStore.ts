import { create } from 'zustand'

import { StorageService, configService, runtimeService } from '@/services'
import {
  LibraryConfig,
  RuntimeAppStatusInfo,
  StorageProviderInterface,
} from '@/types'

type AppState = {
  isOpenSidebar: boolean
  isNeedFitStyleOs: boolean
  isOpenMobileDrawer: boolean
  providers: StorageProviderInterface[]
  mediaLibraries: LibraryConfig[]
  systemInfo: RuntimeAppStatusInfo
  loadProviders: () => Promise<void>
  loadMediaLibraries: () => Promise<void>
  loadAppInfo: () => Promise<void>
  switchSidebar: () => void
  switchMobileDrawer: () => void
  closeMobileDrawer: () => void
}

export const useAppStore = create<AppState>((set) => ({
  isOpenSidebar: true,
  isNeedFitStyleOs: false,
  isOpenMobileDrawer: false,
  providers: [],
  mediaLibraries: [],
  systemInfo: {
    desktop_mode: false,
    is_dev: false,
    port: 0,
    boot_time: '',
    os: '',
    arch: '',
  },
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
  loadAppInfo: async () => {
    const info = await runtimeService.getRuntimeAppStatusInfo()
    const { os, desktop_mode } = info

    const isNeedFitStyleOs =
      desktop_mode && (os === 'windows' || os === 'darwin')

    set({ isNeedFitStyleOs, systemInfo: info })
  },
}))
