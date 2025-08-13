import { create } from 'zustand'

type AppState = {
  isOpenSidebar: boolean
  switchSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  isOpenSidebar: true,
  switchSidebar: () => set((s) => ({ isOpenSidebar: !s.isOpenSidebar })),
}))
