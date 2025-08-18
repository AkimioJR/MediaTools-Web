import type { FanartConfig } from '@/types/config'

import { useState, useCallback } from 'react'

import { configService } from '@/services/config'
import { showSuccess, handleApiError } from '@/utils/message'

export const useFanartConfig = () => {
  const [fanartConfig, setFanartConfig] = useState<FanartConfig | null>(null)
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const config = await configService.getFanartConfig()

      setFanartConfig(config)
    } catch (error) {
      handleApiError(error, '加载Fanart配置失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateData = useCallback(async () => {
    if (!fanartConfig) return

    setLoading(true)
    try {
      const updatedConfig = await configService.updateFanartConfig(fanartConfig)

      setFanartConfig(updatedConfig)
      showSuccess('Fanart配置保存成功')

      return updatedConfig
    } catch (error) {
      handleApiError(error, '保存Fanart配置失败')
    } finally {
      setLoading(false)
    }
  }, [fanartConfig])

  const updateConfig = useCallback((updates: Partial<FanartConfig>) => {
    setFanartConfig((prev) => (prev ? { ...prev, ...updates } : null))
  }, [])

  return {
    fanartConfig,
    loading,
    loadData,
    updateData,
    updateConfig,
  }
}
