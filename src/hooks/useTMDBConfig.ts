import type { TMDBConfig } from '@/types/config'

import { useState, useCallback } from 'react'

import { configService } from '@/services/config'
import { showSuccess, handleApiError } from '@/utils/message'

export const useTMDBConfig = () => {
  const [tmdbConfig, setTmdbConfig] = useState<TMDBConfig | null>(null)
  const [loading, setLoading] = useState(false)

  // 语言选项
  const tmdbLanguageOptions = [
    { label: '简体中文', value: 'zh-CN' },
    { label: '繁体中文 (香港)', value: 'zh-HK' },
    { label: '繁体中文 (台湾)', value: 'zh-TW' },
    { label: '英语 (美国)', value: 'en-US' },
    { label: '日语', value: 'ja-JP' },
    { label: '韩语', value: 'ko-KR' },
  ]

  // 图片语言选项
  const imageLanguageOptions = [
    { label: '中文(zh)', value: 'zh' },
    { label: '英文(en)', value: 'en' },
    { label: '日文(ja)', value: 'ja' },
    { label: '韩文(ko)', value: 'ko' },
    { label: '无语言(null)', value: 'null' },
  ]

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
    tmdbLanguageOptions,
    imageLanguageOptions,
    loading,
    loadData,
    updateData,
    updateConfig,
  }
}
