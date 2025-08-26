import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { HardDrive } from 'lucide-react'

import { BaseSettingsCard, LoadingSpinner } from './BaseSettingsCard'
import { SETTINGS_STYLES } from './constants'

import {
  useTMDBConfig,
  useFanartConfig,
  useSettingsLoader,
} from '@/hooks/settings'

export function ScrapeSettings() {
  const {
    tmdbConfig,
    loading: tmdbLoading,
    loadData: loadTmdbData,
    updateData: updateTmdbData,
    updateConfig: updateTmdbConfig,
    tmdbLanguageOptions,
    imageLanguageOptions,
  } = useTMDBConfig()
  const {
    fanartConfig,
    loading: fanartLoading,
    loadData: loadFanartData,
    updateData: updateFanartData,
    updateConfig: updateFanartConfig,
    fanartLanguageOptions,
  } = useFanartConfig()

  useSettingsLoader({ loadData: loadTmdbData })
  useSettingsLoader({ loadData: loadFanartData })

  const loading = tmdbLoading || fanartLoading

  if (loading && !tmdbConfig && !fanartConfig) {
    return <LoadingSpinner />
  }

  return (
    <div className={SETTINGS_STYLES.container}>
      {/* TMDB 设置 */}
      <BaseSettingsCard
        icon={HardDrive}
        loading={tmdbLoading}
        title="TMDB 设置"
        onSave={updateTmdbData}
      >
        <Input
          defaultValue={tmdbConfig?.api_key || ''}
          label="TMDB API Key"
          placeholder="输入 TMDB API Key"
          onValueChange={(value) => updateTmdbConfig({ api_key: value })}
        />
        <Input
          defaultValue={tmdbConfig?.api_url || ''}
          label="TMDB API URL"
          placeholder="输入 TMDB API URL"
          onValueChange={(value) => updateTmdbConfig({ api_url: value })}
        />
        <Input
          defaultValue={tmdbConfig?.image_url || ''}
          label="TMDB 图片 URL"
          placeholder="输入 TMDB 图片 URL"
          onValueChange={(value) => updateTmdbConfig({ image_url: value })}
        />
        <div className={SETTINGS_STYLES.grid}>
          <Select
            label="语言设置"
            placeholder="选择语言"
            selectedKeys={tmdbConfig?.language ? [tmdbConfig.language] : []}
            onSelectionChange={(keys) =>
              updateTmdbConfig({ language: Array.from(keys)[0] as string })
            }
          >
            {tmdbLanguageOptions.map((opt) => (
              <SelectItem key={opt.value}>{opt.label}</SelectItem>
            ))}
          </Select>

          <Select
            label="图片语言（可多选）"
            placeholder="选择图片语言"
            selectedKeys={
              tmdbConfig?.include_image_language
                ? tmdbConfig.include_image_language
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                : []
            }
            selectionMode="multiple"
            onSelectionChange={(keys) => {
              if (keys === 'all') {
                updateTmdbConfig({
                  include_image_language: imageLanguageOptions
                    .map((o) => o.value)
                    .join(','),
                })
              } else {
                updateTmdbConfig({
                  include_image_language: Array.from(keys).join(','),
                })
              }
            }}
          >
            {imageLanguageOptions.map((opt) => (
              <SelectItem key={opt.value}>{opt.label}</SelectItem>
            ))}
          </Select>
        </div>
      </BaseSettingsCard>

      {/* Fanart 设置 */}
      <BaseSettingsCard
        icon={HardDrive}
        loading={fanartLoading}
        title="Fanart 设置"
        onSave={updateFanartData}
      >
        <Input
          defaultValue={fanartConfig?.api_key || ''}
          label="Fanart API Key"
          placeholder="输入 Fanart API Key"
          onValueChange={(value) => updateFanartConfig({ api_key: value })}
        />
        <Input
          defaultValue={fanartConfig?.api_url || ''}
          label="Fanart API URL"
          placeholder="输入 Fanart API URL"
          onValueChange={(value) => updateFanartConfig({ api_url: value })}
        />
        <Select
          label="语言（可多选）"
          placeholder="选择语言"
          selectedKeys={fanartConfig?.languages || []}
          selectionMode="multiple"
          onSelectionChange={(keys) => {
            if (keys === 'all') {
              updateFanartConfig({
                languages: fanartLanguageOptions.map((o) => o.value),
              })
            } else {
              updateFanartConfig({ languages: Array.from(keys).map(String) })
            }
          }}
        >
          {fanartLanguageOptions.map((opt) => (
            <SelectItem key={opt.value}>{opt.label}</SelectItem>
          ))}
        </Select>
      </BaseSettingsCard>
    </div>
  )
}
