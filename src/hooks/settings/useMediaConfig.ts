import type {
  LibraryConfig,
  FormatConfig,
  CustomWordConfig,
} from '@/types/config'

import { useState, useCallback } from 'react'

import { configService } from '@/services/config'
import { showSuccess, handleApiError } from '@/utils/message'

export const useMediaConfig = () => {
  const [libraries, setLibraries] = useState<LibraryConfig[]>([])
  const [formatConfig, setFormatConfig] = useState<FormatConfig | null>(null)
  const [customWordConfig, setCustomWordConfig] =
    useState<CustomWordConfig | null>(null)
  const [loading, setLoading] = useState(false)

  const loadLibrariesData = useCallback(async () => {
    setLoading(true)
    try {
      const config = await configService.getMediaLibrariesConfig()

      setLibraries(config)
    } catch (error) {
      handleApiError(error, '加载媒体库配置失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadFormatData = useCallback(async () => {
    setLoading(true)
    try {
      const config = await configService.getMediaFormatConfig()

      setFormatConfig(config)
    } catch (error) {
      handleApiError(error, '加载格式配置失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadCustomWordData = useCallback(async () => {
    setLoading(true)
    try {
      const config = await configService.getCustomWordConfig()

      setCustomWordConfig(config)
    } catch (error) {
      handleApiError(error, '加载自定义词条配置失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadAllData = useCallback(async () => {
    await Promise.all([
      loadLibrariesData(),
      loadFormatData(),
      loadCustomWordData(),
    ])
  }, [loadLibrariesData, loadFormatData, loadCustomWordData])

  const updateLibrariesData = useCallback(async () => {
    setLoading(true)
    try {
      const updatedConfig =
        await configService.updateMediaLibrariesConfig(libraries)

      setLibraries(updatedConfig)
      showSuccess('媒体库配置保存成功')

      return updatedConfig
    } catch (error) {
      handleApiError(error, '保存媒体库配置失败')
    } finally {
      setLoading(false)
    }
  }, [libraries])

  const updateFormatData = useCallback(async () => {
    if (!formatConfig) return

    setLoading(true)
    try {
      const updatedConfig =
        await configService.updateMediaFormatConfig(formatConfig)

      setFormatConfig(updatedConfig)
      showSuccess('格式配置保存成功')

      return updatedConfig
    } catch (error) {
      handleApiError(error, '保存格式配置失败')
    } finally {
      setLoading(false)
    }
  }, [formatConfig])

  const updateCustomWordData = useCallback(async () => {
    if (!customWordConfig) return

    setLoading(true)
    try {
      const updatedConfig =
        await configService.updateCustomWordConfig(customWordConfig)

      setCustomWordConfig(updatedConfig)
      showSuccess('自定义词条配置保存成功')

      return updatedConfig
    } catch (error) {
      handleApiError(error, '保存自定义词条配置失败')
    } finally {
      setLoading(false)
    }
  }, [customWordConfig])

  return {
    // 数据
    libraries,
    formatConfig,
    customWordConfig,
    loading,

    // 加载方法
    loadLibrariesData,
    loadFormatData,
    loadCustomWordData,
    loadAllData,

    // 更新方法
    updateLibrariesData,
    updateFormatData,
    updateCustomWordData,

    // 设置方法
    setLibraries,
    setFormatConfig,
    setCustomWordConfig,
  }
}
