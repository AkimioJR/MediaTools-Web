import type { StorageFileInfo } from '@/types/storage'
import type { SortMode } from '@/ui/storage'

import { useMemo } from 'react'

export const useDataSort = (
  filesData: StorageFileInfo[],
  sortMode: SortMode,
) => {
  const sortedData = useMemo(() => {
    if (!Array.isArray(filesData) || filesData.length === 0) return []

    const compareCore = (a: StorageFileInfo, b: StorageFileInfo) => {
      switch (sortMode) {
        case 'name_asc':
          return a.name.localeCompare(b.name)
        case 'name_desc':
          return b.name.localeCompare(a.name)
        case 'mod_time_asc':
          return (
            new Date(a?.mod_time || '').getTime() -
            new Date(b?.mod_time || '').getTime()
          )
        case 'mod_time_desc':
          return (
            new Date(b?.mod_time || '').getTime() -
            new Date(a?.mod_time || '').getTime()
          )
        default:
          return 0
      }
    }

    const sorted = [...filesData].sort((a, b) => {
      const aIsDir = a.type === 'Directory'
      const bIsDir = b.type === 'Directory'

      if (aIsDir !== bIsDir) return aIsDir ? -1 : 1

      return compareCore(a, b)
    })

    return sorted
  }, [filesData, sortMode])

  return sortedData
}
