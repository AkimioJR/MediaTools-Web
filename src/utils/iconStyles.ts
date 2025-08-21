export const ICON_BADGE_BASE =
  'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200'

export const ICON_BADGE_STYLES = {
  dashboard: {
    selected: `${ICON_BADGE_BASE} bg-blue-500 text-white shadow-lg shadow-blue-500/25`,
    default: `${ICON_BADGE_BASE} bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900`,
  },
  storage: {
    selected: `${ICON_BADGE_BASE} bg-green-500 text-white shadow-lg shadow-green-500/25`,
    default: `${ICON_BADGE_BASE} bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900`,
  },
  settings: {
    selected: `${ICON_BADGE_BASE} bg-purple-500 text-white shadow-lg shadow-purple-500/25`,
    default: `${ICON_BADGE_BASE} bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900`,
  },

  default: {
    selected: `${ICON_BADGE_BASE} bg-primary text-white shadow-lg`,
    default: `${ICON_BADGE_BASE} bg-default-100 text-default-600 hover:bg-default-200`,
  },
} as const

export function getMenuIconClass(kind: string, selected: boolean): string {
  const styleGroup =
    ICON_BADGE_STYLES[kind as keyof typeof ICON_BADGE_STYLES] ||
    ICON_BADGE_STYLES.default

  return selected ? styleGroup.selected : styleGroup.default
}
