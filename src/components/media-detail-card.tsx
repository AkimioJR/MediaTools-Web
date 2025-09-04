import type { MediaItem } from '@/types/media'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Image } from '@heroui/image'
import { Chip } from '@heroui/chip'
import { Link } from '@heroui/link'

import { TMDBService } from '@/services/tmdb'
import { CustomTabs, type TabItem } from '@/components/custom-tabs'
import LabelValue from '@/components/LabelValue'
import { cn } from '@/utils'

export interface MediaDetailCardProps {
  item: MediaItem
  customRule?: string
  metaRule?: string
  appendTabs?: TabItem[]
  tabsScrollable?: boolean
}

const CachedImage = React.memo(function CachedImage({
  src,
  alt,
  isLoading,
  imgClassName,
}: {
  src: string
  alt: string
  isLoading: boolean
  imgClassName?: string
}) {
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [src])

  const handleError = useCallback(() => {
    setImageError(true)
  }, [])

  if ((!src || imageError) && !isLoading) {
    return (
      <div className="w-full h-full bg-default-100 rounded-lg flex items-center justify-center border-2 border-dashed border-default-300">
        <div className="text-center text-default-500">
          <div className="text-2xl sm:text-3xl md:text-4xl mb-2">🎬</div>
          <p className="text-xs sm:text-sm">暂无封面</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <Image
        isBlurred
        isZoomed
        alt={alt}
        className={cn('full', imgClassName)}
        isLoading={isLoading}
        radius="lg"
        src={src}
        onError={handleError}
      />
    </div>
  )
})

export default function MediaDetailCard({
  item,
  customRule,
  metaRule,
  appendTabs,
  tabsScrollable = false,
}: MediaDetailCardProps) {
  const [activeTab, setActiveTab] = useState<string>('basic')
  const [posterUrl, setPosterUrl] = useState<string>('')
  const [overview, setOverview] = useState<string>('')
  const [overviewLoading, setOverviewLoading] = useState<boolean>(false)
  const [posterLoading, setPosterLoading] = useState<boolean>(false)
  const [overviewError, setOverviewError] = useState<boolean>(false)

  const lastRequestedIdRef = useRef<string | null>(null)

  const isTV = item.media_type === 'TV'

  const mediaIdentifier = useMemo(() => {
    if (item?.tmdb_id && item?.media_type) {
      return {
        tmdbId: item.tmdb_id,
        mediaType: String(item.media_type).toLowerCase(),
      }
    }

    return null
  }, [item?.tmdb_id, item?.media_type])

  useEffect(() => {
    if (!mediaIdentifier) return
    const { mediaType, tmdbId } = mediaIdentifier
    const requestId = `${mediaType}-${tmdbId}`

    if (lastRequestedIdRef.current === requestId) {
      return
    }
    lastRequestedIdRef.current = requestId

    setPosterUrl('')
    setOverview('')
    setOverviewLoading(true)
    setPosterLoading(true)
    setOverviewError(false)

    TMDBService.ImageService.GetPosterImage(mediaType, tmdbId)
      .then((url) => {
        if (lastRequestedIdRef.current === requestId) setPosterUrl(url)
      })
      .catch(() => {})
      .finally(() => {
        if (lastRequestedIdRef.current === requestId) setPosterLoading(false)
      })

    TMDBService.GetOverview(mediaType, tmdbId)
      .then((text) => {
        if (lastRequestedIdRef.current === requestId) setOverview(text)
      })
      .catch(() => {
        if (lastRequestedIdRef.current === requestId) setOverviewError(true)
      })
      .finally(() => {
        if (lastRequestedIdRef.current === requestId) setOverviewLoading(false)
      })
  }, [mediaIdentifier])

  const renderFields = (
    fields: Array<{ label: string; value: any; href?: string }>,
    isFilterEmpty = false,
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {(isFilterEmpty ? fields.filter((f) => f.value) : fields).map(
        (field, index) => (
          <LabelValue key={index} label={field.label}>
            {field.href ? (
              <Link href={field.href} target="_blank">
                {field.value}
              </Link>
            ) : (
              field.value
            )}
          </LabelValue>
        ),
      )}
    </div>
  )

  const tabItems: TabItem[] = [
    {
      key: 'basic',
      title: '基本信息',
      content: (
        <div className="space-y-4">
          {renderFields([
            { label: '标题', value: item.title },
            { label: '原始标题', value: item.original_title },
            { label: '年份', value: item.year },
            { label: '媒体类型', value: item.media_type },
            {
              label: 'TMDB ID',
              value: item.tmdb_id,
              href: item.tmdb_id
                ? `https://www.themoviedb.org/${isTV ? 'tv' : 'movie'}/${item.tmdb_id}`
                : undefined,
            },
            {
              label: 'TVDB ID',
              value: item.tvdb_id,
              href: item.tvdb_id
                ? `https://thetvdb.com/?tab=series&id=${item.tvdb_id}`
                : undefined,
            },
            {
              label: 'IMDb ID',
              value: item.imdb_id,
              href: item.imdb_id
                ? `https://www.imdb.com/title/${item.imdb_id}`
                : undefined,
            },
          ])}
        </div>
      ),
    },
    {
      key: 'overview',
      title: '简介',
      content: (
        <div className="space-y-4">
          {overviewLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-default-200 rounded animate-pulse" />
              <div className="h-4 bg-default-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-default-200 rounded animate-pulse w-1/2" />
            </div>
          ) : overviewError ? (
            <div className="p-4 rounded-lg bg-warning-50 border border-warning-200">
              <p className="text-warning-700">简介获取失败</p>
            </div>
          ) : overview ? (
            <div className="prose prose-sm max-w-none text-default-700">
              <p className="leading-relaxed">{overview}</p>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-default-50 border border-default-200">
              <p className="text-default-500">暂无简介信息</p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'resource',
      title: '资源信息',
      content: (
        <div className="space-y-4">
          {renderFields(
            [
              { label: '分辨率', value: item.resource_pix },
              { label: '视频编码', value: item.video_encode },
              { label: '音频编码', value: item.audio_encode },
              { label: '资源类型', value: item.resource_type },
              { label: '分段', value: item.part },
              { label: '版本', value: item.version },
              { label: '平台', value: item.platform },
              { label: '文件扩展名', value: item.file_extension },
            ],
            true,
          )}
          {item.release_groups.length > 0 && (
            <div>
              <LabelValue label="发布组">
                <div className="mt-1 flex flex-wrap gap-1">
                  {item.release_groups.map((group, index) => (
                    <Chip key={index} size="sm" variant="flat">
                      {group}
                    </Chip>
                  ))}
                </div>
              </LabelValue>
            </div>
          )}

          {item.resource_effect.length > 0 && (
            <div>
              <LabelValue label="资源效果">
                <div className="mt-1 flex flex-wrap gap-1">
                  {item.resource_effect.map((effect, index) => (
                    <Chip
                      key={index}
                      color="secondary"
                      size="sm"
                      variant="flat"
                    >
                      {effect}
                    </Chip>
                  ))}
                </div>
              </LabelValue>
            </div>
          )}
        </div>
      ),
    },
  ]

  if (isTV) {
    tabItems.splice(2, 0, {
      key: 'tv',
      title: '电视剧信息',
      content: (
        <div className="space-y-4">
          {renderFields([
            { label: '季数', value: item.season_str },
            { label: '集数', value: item.episode_str },
            { label: '集标题', value: item.episode_title },
            { label: '季发布年份', value: item.season_year },
            { label: '集发布日期', value: item.episode_date },
          ])}
        </div>
      ),
    })
  }

  if (customRule || metaRule) {
    tabItems.push({
      key: 'rules',
      title: '规则信息',
      content: (
        <div className="space-y-4">
          {customRule && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-default-600">自定义规则</p>
              <p className="text-default-900 font-mono text-sm bg-default-100 p-2 rounded">
                {customRule}
              </p>
            </div>
          )}
          {metaRule && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-default-600">元数据规则</p>
              <p className="text-default-900 font-mono text-sm bg-default-100 p-2 rounded">
                {metaRule}
              </p>
            </div>
          )}
        </div>
      ),
    })
  }

  if (appendTabs && appendTabs.length > 0) {
    tabItems.push(...appendTabs)
  }

  const handleTabChange = useCallback((key: string) => setActiveTab(key), [])

  return (
    <Card className="w-full" shadow="sm">
      <CardHeader className="flex gap-3 bg-gradient-to-r from-success-500 to-success-600 text-white p-4 lg:p-6">
        <div className="flex flex-col">
          <p className="text-lg lg:text-xl font-semibold truncate">
            {item.title}
          </p>
          <p className="mt-1 text-xs lg:text-sm text-white/70 tracking-wide">
            {item.year} · {item.media_type}
          </p>
        </div>
      </CardHeader>
      <CardBody className="p-0 max-h-[60vh] md:max-h-[65vh] overflow-y-auto scrollbar-hide">
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6 p-4 lg:p-6">
          <div className="flex-shrink-0 flex justify-center md:justify-start">
            <div className="w-32 h-48 sm:w-40 sm:h-60 md:w-48 md:h-72 relative overflow-visible">
              <CachedImage
                alt={`${item.title} poster`}
                imgClassName="w-32 h-48 sm:w-40 sm:h-60 md:w-48 md:h-72"
                isLoading={posterLoading}
                src={posterUrl}
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <CustomTabs
              activeKey={activeTab}
              items={tabItems}
              scrollable={tabsScrollable}
              onActiveKeyChange={handleTabChange}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
