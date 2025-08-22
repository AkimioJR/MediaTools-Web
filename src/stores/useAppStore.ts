import { create } from 'zustand'

import { StorageService } from '@/services/storage'
import { StorageProviderInterface } from '@/types'

type AppState = {
  isOpenSidebar: boolean
  isOpenMobileDrawer: boolean
  providers: StorageProviderInterface[]
  loadProviders: () => Promise<void>
  switchSidebar: () => void
  switchMobileDrawer: () => void
  closeMobileDrawer: () => void
}

export const useAppStore = create<AppState>((set) => ({
  isOpenSidebar: true,
  isOpenMobileDrawer: false,
  providers: [],

  switchSidebar: () => set((s) => ({ isOpenSidebar: !s.isOpenSidebar })),
  switchMobileDrawer: () =>
    set((s) => ({ isOpenMobileDrawer: !s.isOpenMobileDrawer })),
  closeMobileDrawer: () => set({ isOpenMobileDrawer: false }),
  loadProviders: async () =>
    set({ providers: await StorageService.ProviderService.getProviderList() }),
}))
