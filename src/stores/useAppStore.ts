import { create } from 'zustand'

type AppState = {
  isOpenSidebar: boolean
  isOpenMobileDrawer: boolean
  switchSidebar: () => void
  switchMobileDrawer: () => void
  closeMobileDrawer: () => void
}

export const useAppStore = create<AppState>((set) => ({
  isOpenSidebar: true,
  isOpenMobileDrawer: false,
  switchSidebar: () => set((s) => ({ isOpenSidebar: !s.isOpenSidebar })),
  switchMobileDrawer: () =>
    set((s) => ({ isOpenMobileDrawer: !s.isOpenMobileDrawer })),
  closeMobileDrawer: () => set({ isOpenMobileDrawer: false }),
}))
