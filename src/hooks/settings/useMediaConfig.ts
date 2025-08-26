import type {
  LibraryConfig,
  FormatConfig,
  CustomWordConfig,
} from '@/types/config'

import { useState, useCallback } from 'react'

import { configService } from '@/services/config'
import { showSuccess, handleApiError } from '@/utils/message'
import { useAppStore } from '@/stores/useAppStore'

export const useMediaConfig = () => {
  const { mediaLibraries } = useAppStore()
  const [libraries, setLibraries] = useState<LibraryConfig[]>(mediaLibraries)
  const [formatConfig, setFormatConfig] = useState<FormatConfig | null>(null)
  const [customWordConfig, setCustomWordConfig] =
    useState<CustomWordConfig | null>(null)
  const [loading, setLoading] = useState(false)

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
    await Promise.all([loadFormatData(), loadCustomWordData()])
  }, [loadFormatData, loadCustomWordData])

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
    libraries,
    formatConfig,
    customWordConfig,
    loading,

    loadFormatData,
    loadCustomWordData,
    loadAllData,

    updateLibrariesData,
    updateFormatData,
    updateCustomWordData,

    setLibraries,
    setFormatConfig,
    setCustomWordConfig,
  }
}
