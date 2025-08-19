import { Card, CardBody, CardHeader } from '@heroui/card'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Button } from '@heroui/button'
import { Spinner } from '@heroui/spinner'
import { Image, Video } from 'lucide-react'
import { useEffect } from 'react'

import { useTMDBConfig, useFanartConfig } from '@/hooks'

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

  useEffect(() => {
    loadTmdbData()
    loadFanartData()
  }, [loadTmdbData, loadFanartData])

  const loading = tmdbLoading || fanartLoading

  if (loading && !tmdbConfig && !fanartConfig) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner label="加载配置中..." />
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* TMDB 设置 */}
      <Card radius="lg" shadow="sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold">TMDB 设置</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          <Input
            label="TMDB API Key"
            placeholder="输入 TMDB API Key"
            value={tmdbConfig?.api_key || ''}
            onValueChange={(value) => updateTmdbConfig({ api_key: value })}
          />
          <Input
            label="TMDB API URL"
            placeholder="输入 TMDB API URL"
            value={tmdbConfig?.api_url || ''}
            onValueChange={(value) => updateTmdbConfig({ api_url: value })}
          />
          <Input
            label="TMDB 图片 URL"
            placeholder="输入 TMDB 图片 URL"
            value={tmdbConfig?.image_url || ''}
            onValueChange={(value) => updateTmdbConfig({ image_url: value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="flex justify-end">
            <Button
              color="primary"
              isLoading={tmdbLoading}
              onPress={updateTmdbData}
            >
              {tmdbLoading ? '保存中...' : '保存 TMDB 配置'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Fanart 设置 */}
      <Card radius="lg" shadow="sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold">Fanart 设置</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          <Input
            label="Fanart API Key"
            placeholder="输入 Fanart API Key"
            value={fanartConfig?.api_key || ''}
            onValueChange={(value) => updateFanartConfig({ api_key: value })}
          />
          <Input
            label="Fanart API URL"
            placeholder="输入 Fanart API URL"
            value={fanartConfig?.api_url || ''}
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
          <div className="flex justify-end">
            <Button
              color="primary"
              isLoading={fanartLoading}
              onPress={updateFanartData}
            >
              {fanartLoading ? '保存中...' : '保存 Fanart 配置'}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
