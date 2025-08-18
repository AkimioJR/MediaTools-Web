import type { LogConfig } from '@/types/config'

import { useState, useCallback } from 'react'

import { configService } from '@/services/config'
import { showSuccess, handleApiError } from '@/utils/message'

export const useLogConfig = () => {
  const [logConfig, setLogConfig] = useState<LogConfig | null>(null)
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)

    try {
      const config = await configService.getLogConfig()

      setLogConfig(config)
    } catch (error) {
      handleApiError(error, '加载日志配置失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateData = useCallback(async () => {
    if (!logConfig) return

    setLoading(true)
    try {
      const updatedConfig = await configService.updateLogConfig(logConfig)

      setLogConfig(updatedConfig)
      showSuccess('日志配置保存成功')

      return updatedConfig
    } catch (error) {
      handleApiError(error, '保存日志配置失败')
    } finally {
      setLoading(false)
    }
  }, [logConfig])

  const updateConfig = useCallback((updates: Partial<LogConfig>) => {
    setLogConfig((prev) => (prev ? { ...prev, ...updates } : null))
  }, [])

  return {
    logConfig,
    loading,
    loadData,
    updateData,
    updateConfig,
  }
}
