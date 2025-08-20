import type { RecognizeMediaDetail } from '@/types/media'

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Link } from '@heroui/link'
import { Chip } from '@heroui/chip'
import { Divider } from '@heroui/divider'
import { Image } from '@heroui/image'
import { Spinner } from '@heroui/spinner'

import { RecognizeService } from '@/services/recognize'
import { TMDBService } from '@/services/tmdb'
import { CustomTabs, type TabItem } from '@/components/custom-tabs'

// 缓存图片组件，避免重新渲染时闪烁
const CachedImage = React.memo(function CachedImage({
  src,
  alt,
  onError,
  isLoading,
}: {
  src: string
  alt: string
  className?: string
  isLoading: boolean
  onError?: () => void
}) {
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setImageError(false)
  }, [src])

  const handleError = useCallback(() => {
    setImageError(true)
    onError?.()
  }, [onError])

  const handleLoad = useCallback(() => {
    setImageError(false)
  }, [src])

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
        className="full"
        isLoading={isLoading}
        radius="lg"
        src={src}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  )
})

interface MediaDetailProps {
  mediaResp?: RecognizeMediaDetail | null
  errMsg?: string | null
}

const MediaDetail = React.memo(function MediaDetail({
  mediaResp,
  errMsg,
}: MediaDetailProps) {
  const [activeTab, setActiveTab] = useState<string>('basic')
  const [posterUrl, setPosterUrl] = useState<string>('')
  const [overview, setOverview] = useState<string>('')
  const [overviewLoading, setOverviewLoading] = useState<boolean>(false)
  const [posterLoading, setPosterLoading] = useState<boolean>(false)
  const [overviewError, setOverviewError] = useState<boolean>(false)

  const lastRequestedIdRef = useRef<string | null>(null)

  const renderFields = (
    fields: Array<{ label: string; value: any; href?: string }>,
    isFilterEmpty = false,
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {(isFilterEmpty ? fields.filter((field) => field.value) : fields).map(
        (field, index) => (
          <div key={index}>
            <p className="text-sm font-medium text-default-600">
              {field.label}
            </p>
            <p className="text-default-900">
              {field.href ? (
                <Link href={field.href} target="_blank">
                  {field.value}
                </Link>
              ) : (
                field.value
              )}
            </p>
          </div>
        ),
      )}
    </div>
  )

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key)
  }, [])

  const mediaIdentifier = useMemo(() => {
    if (mediaResp?.item?.tmdb_id && mediaResp?.item?.media_type) {
      return {
        tmdbId: mediaResp.item.tmdb_id,
        mediaType: mediaResp.item.media_type.toLowerCase(),
      }
    }

    return null
  }, [mediaResp?.item?.tmdb_id, mediaResp?.item?.media_type])

  useEffect(() => {
    if (!mediaIdentifier) return

    const { mediaType, tmdbId } = mediaIdentifier
    const requestId = `${mediaType}-${tmdbId}`

    if (lastRequestedIdRef.current === requestId) {
      return
    }

    lastRequestedIdRef.current = requestId

    // 重置状态
    setPosterUrl('')
    setOverviewLoading(true)
    setPosterLoading(true)
    setOverviewError(false)
    setOverview('')

    // 并行获取封面图和简介
    TMDBService.ImageService.GetPosterImage(mediaType, tmdbId)
      .then((url) => {
        // 检查请求是否还是当前的
        if (lastRequestedIdRef.current === requestId) {
          setPosterUrl(url)
        }
      })
      .catch((error) => {
        console.error('Failed to fetch poster:', error)
      })
      .finally(() => {
        setPosterLoading(false)
      })

    TMDBService.GetOverview(mediaType, tmdbId)
      .then((overviewText) => {
        if (lastRequestedIdRef.current === requestId) {
          setOverview(overviewText)
        }
      })
      .catch((error) => {
        console.error('Failed to fetch overview:', error)
        if (lastRequestedIdRef.current === requestId) {
          setOverviewError(true)
        }
      })
      .finally(() => {
        if (lastRequestedIdRef.current === requestId) {
          setOverviewLoading(false)
        }
      })
  }, [mediaIdentifier])

  if (errMsg) {
    return (
      <Card className="w-full">
        <CardBody>
          <div className="p-4 rounded-lg bg-danger-50 border border-danger-200">
            <div className="flex items-center gap-2 text-danger-600">
              <span className="font-medium">识别失败</span>
            </div>
            <p className="text-danger-700 mt-1">{errMsg}</p>
          </div>
        </CardBody>
      </Card>
    )
  }

  if (!mediaResp?.item.title) {
    return null
  }

  const { item } = mediaResp
  const isTV = item.media_type === 'TV'

  // 创建tab项数组
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
              { label: '平台', value: item.platform },
              { label: '发布版本', value: item.version },
              { label: '文件扩展名', value: item.file_extension },
            ],
            true,
          )}

          {item.release_groups.length > 0 && (
            <div>
              <p className="text-sm font-medium text-default-600 mb-2">
                发布组
              </p>
              <div className="flex flex-wrap gap-1">
                {item.release_groups.map((group, index) => (
                  <Chip key={index} size="sm" variant="flat">
                    {group}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {item.resource_effect.length > 0 && (
            <div>
              <p className="text-sm font-medium text-default-600 mb-2">
                资源效果
              </p>
              <div className="flex flex-wrap gap-1">
                {item.resource_effect.map((effect, index) => (
                  <Chip key={index} color="secondary" size="sm" variant="flat">
                    {effect}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
  ]

  // 如果是电视剧，在资源信息后插入电视剧信息
  if (isTV) {
    const tvTab: TabItem = {
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
    }

    // 在索引2（简介之后）插入电视剧信息
    tabItems.splice(2, 0, tvTab)
  }

  if (mediaResp.custom_rule || mediaResp.meta_rule) {
    // 仅在存在任一规则时加入规则 tab，并且只渲染存在的规则区块
    tabItems.push({
      key: 'rules',
      title: '规则信息',
      content: (
        <div className="space-y-4">
          {mediaResp.custom_rule && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-default-600">自定义规则</p>
              <p className="text-default-900 font-mono text-sm bg-default-100 p-2 rounded">
                {mediaResp.custom_rule}
              </p>
            </div>
          )}

          {mediaResp.meta_rule && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-default-600">元数据规则</p>
              <p className="text-default-900 font-mono text-sm bg-default-100 p-2 rounded">
                {mediaResp.meta_rule}
              </p>
            </div>
          )}
        </div>
      ),
    })
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Card className="w-full" shadow="sm">
        <CardHeader className="flex gap-3 bg-gradient-to-r from-success-500 to-success-600 text-white p-4 lg:p-6">
          <div className="flex flex-col">
            <p className="text-lg lg:text-xl font-semibold break-words">
              {item.title}
            </p>
            <p className="text-small text-white/80">
              {item.year} | {item.media_type}
            </p>
          </div>
        </CardHeader>
        <CardBody className="p-0 max-h-[55vh] md:max-h-[65vh] overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-4 lg:gap-6 p-4 lg:p-6">
            {/* 左侧封面图区域 */}
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <div className="w-32 h-48 sm:w-40 sm:h-60 md:w-48 md:h-72 relative overflow-visible">
                <CachedImage
                  alt={`${item.title} poster`}
                  className="w-full h-full object-cover rounded-lg"
                  isLoading={posterLoading}
                  src={posterUrl}
                />
              </div>
            </div>

            {/* 右侧信息区域 */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 min-w-0"
              initial={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <CustomTabs
                activeKey={activeTab}
                items={tabItems}
                onActiveKeyChange={handleTabChange}
              />
            </motion.div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  )
})

export function MediaRecognitionDialog({
  defaultValue = '',
}: {
  defaultValue?: string
}) {
  const [mediaTitle, setMediaTitle] = useState(defaultValue)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<RecognizeMediaDetail | null>(null)
  const [errMsg, setErrMsg] = useState<string | null>(null)

  useEffect(() => {
    if (defaultValue && defaultValue.trim()) {
      setMediaTitle(defaultValue)
      const timer = setTimeout(() => {
        handleRecognize(defaultValue)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [defaultValue])

  async function handleRecognize(title?: string) {
    const targetTitle = title || mediaTitle

    if (!targetTitle.trim()) return

    setIsLoading(true)
    setResult(null)
    setErrMsg(null)

    try {
      const response = await RecognizeService.RecognizeMedia(targetTitle.trim())

      setResult(response)
    } catch (error) {
      setResult(null)
      setErrMsg((error as Error).message)
      console.error('Media recognition error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && mediaTitle.trim()) {
      handleRecognize()
    }
  }

  const getButtonText = () => {
    if (isLoading) {
      return '识别中...'
    } else if (result || errMsg) {
      return '再次识别'
    }

    return '开始识别'
  }

  return (
    <div className="flex flex-col max-h-[85vh] md:max-h-[90vh]">
      {!defaultValue.trim() && (
        <div className="flex gap-3 items-center mb-4 flex-shrink-0">
          <Input
            className="flex-1"
            isDisabled={isLoading}
            label="请输入媒体名称"
            size="sm"
            value={mediaTitle}
            onKeyDown={handleKeyPress}
            onValueChange={setMediaTitle}
          />
          <Button
            className="px-6"
            color="primary"
            isDisabled={!mediaTitle.trim() || isLoading}
            isLoading={isLoading}
            onPress={() => handleRecognize()}
          >
            {getButtonText()}
          </Button>
        </div>
      )}

      {isLoading && Boolean(defaultValue.trim()) && (
        <div className="flex justify-center items-center h-full">
          <Spinner variant="gradient" />
        </div>
      )}

      <AnimatePresence>
        {(result || errMsg) && (
          <motion.div
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-col min-h-0 flex-1"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
            transition={{
              height: { duration: 0.4, ease: 'easeInOut' },
              opacity: { duration: 0.3 },
            }}
          >
            <motion.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              {!defaultValue.trim() && <Divider className="mb-4" />}
            </motion.div>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-h-0 px-1"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <MediaDetail errMsg={errMsg} mediaResp={result} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
