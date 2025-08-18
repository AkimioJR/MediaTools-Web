import type { TMDBConfig } from '@/types/config'

import { useState, useCallback } from 'react'

import { configService } from '@/services/config'
import { showSuccess, handleApiError } from '@/utils/message'

export const useTMDBConfig = () => {
  const [tmdbConfig, setTmdbConfig] = useState<TMDBConfig | null>(null)
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const config = await configService.getTMDBConfig()

      setTmdbConfig(config)
    } catch (error) {
      handleApiError(error, '加载TMDB配置失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateData = useCallback(async () => {
    if (!tmdbConfig) return

    setLoading(true)
    try {
      const updatedConfig = await configService.updateTMDBConfig(tmdbConfig)

      setTmdbConfig(updatedConfig)
      showSuccess('TMDB配置保存成功')

      return updatedConfig
    } catch (error) {
      handleApiError(error, '保存TMDB配置失败')
    } finally {
      setLoading(false)
    }
  }, [tmdbConfig])

  const updateConfig = useCallback((updates: Partial<TMDBConfig>) => {
    setTmdbConfig((prev) => (prev ? { ...prev, ...updates } : null))
  }, [])

  return {
    tmdbConfig,
    loading,
    loadData,
    updateData,
    updateConfig,
  }
}
