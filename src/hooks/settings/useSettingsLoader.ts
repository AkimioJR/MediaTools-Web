import { useEffect } from 'react'

interface UseSettingsLoaderOptions {
  loadData: () => void
  dependencies?: any[]
}

export function useSettingsLoader({
  loadData,
  dependencies = [],
}: UseSettingsLoaderOptions) {
  useEffect(() => {
    loadData()
  }, [loadData, ...dependencies])
}
