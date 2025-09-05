import type { MediaTransferHistory } from '@/types'

import { useState, useEffect, useRef } from 'react'
import { Image } from '@heroui/image'

import { TMDBService } from '@/services/tmdb'
import { cn } from '@/utils'
import { isMo } from '@/utils/windows'

export interface DetailModalProps {
  row: MediaTransferHistory
  onClose: () => void
}

export default function DetailModal({ row }: DetailModalProps) {
  const statusText = row.status ? '成功' : '失败'
  const [posterUrl, setPosterUrl] = useState<string>('')
  const [posterLoading, setPosterLoading] = useState<boolean>(false)
  const [posterError, setPosterError] = useState<boolean>(false)
  const lastRequestedIdRef = useRef<string | null>(null)

  // 获取封面图
  useEffect(() => {
    if (!row.item?.tmdb_id || !row.item?.media_type) return

    const mediaType = String(row.item.media_type).toLowerCase()
    const tmdbId = row.item.tmdb_id
    const requestId = `${mediaType}-${tmdbId}`

    if (lastRequestedIdRef.current === requestId) {
      return
    }
    lastRequestedIdRef.current = requestId

    setPosterUrl('')
    setPosterLoading(true)
    setPosterError(false)

    TMDBService.ImageService.GetPosterImage(mediaType, tmdbId)
      .then((url) => {
        if (lastRequestedIdRef.current === requestId) {
          setPosterUrl(url)
        }
      })
      .catch(() => {
        if (lastRequestedIdRef.current === requestId) {
          setPosterError(true)
        }
      })
      .finally(() => {
        if (lastRequestedIdRef.current === requestId) {
          setPosterLoading(false)
        }
      })
  }, [row.item?.tmdb_id, row.item?.media_type])

  return (
    <div className="space-y-4 max-h-[75vh] overflow-y-auto scrollbar-hide">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <PosterImage
            alt={row.item.title}
            hasError={posterError}
            isLoading={posterLoading}
            src={posterUrl}
          />
        </div>
        <div className="flex-1">
          <Section title="媒体信息">
            <div className="divide-y divide-default-200">
              <Field label="名称">
                <span className="font-medium">{row.item.title}</span>
                {row.item.year ? (
                  <span className="ml-2 text-foreground-500">
                    ({row.item.year})
                  </span>
                ) : null}
              </Field>
              <Field label="原始名称" value={row.item.original_title} />
              <Field label="类型" value={row.item.media_type} />
              {row.item.media_type === 'TV' ? (
                <Field
                  label="季/集"
                  value={`${row.item.season_str} ${row.item.episode_str}`}
                />
              ) : null}
            </div>
          </Section>
        </div>
      </div>

      <Section title="路径">
        <div className="divide-y divide-default-200">
          <Field label="源路径">
            <Mono>{row.src_path}</Mono>
          </Field>
          <Field label="目标路径">
            <Mono>{row.dst_path}</Mono>
          </Field>
        </div>
      </Section>

      <Section title="状态">
        <div className="divide-y divide-default-200">
          <Field label="方式" value={row.transfer_type} />
          <Field label="状态">
            <StatusBadge success={row.status}>{statusText}</StatusBadge>
          </Field>
          {row.message ? (
            <Field label="消息">
              <p className="text-foreground-500 break-words leading-relaxed">
                {row.message}
              </p>
            </Field>
          ) : null}
        </div>
      </Section>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <h4 className="text-sm font-semibold tracking-wide text-foreground-700">
        {title}
      </h4>
      {children}
    </div>
  )
}

function Field({
  label,
  value,
  children,
}: {
  label: string
  value?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className="py-2">
      <div className="text-[11px] text-foreground-400">{label}</div>
      <div className="mt-0.5 text-[13px] sm:text-sm break-words">
        {value ?? children}
      </div>
    </div>
  )
}

function StatusBadge({
  success,
  children,
}: {
  success: boolean
  children: React.ReactNode
}) {
  const base = 'inline-flex items-center rounded-small px-2 py-0.5 text-xs'
  const color = success
    ? 'bg-success-100 text-success-600'
    : 'bg-danger-100 text-danger-600'

  return <span className={`${base} ${color}`}>{children}</span>
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs sm:text-[13px] break-all">
      {children}
    </span>
  )
}

function PosterImage({
  src,
  alt,
  isLoading,
  hasError,
}: {
  src: string
  alt: string
  isLoading: boolean
  hasError: boolean
}) {
  const width = isMo ? 128 : 192
  const height = isMo ? 192 : 288
  const containerClass = 'w-32 h-48 sm:w-48 sm:h-72'

  // 错误状态或无封面状态
  if (hasError || (!src && !isLoading)) {
    const message = hasError ? '封面加载失败' : '暂无封面'

    return (
      <div
        className={cn(
          containerClass,
          'bg-default-100 rounded-lg flex items-center justify-center',
        )}
      >
        <div className="text-center text-default-400">
          <div className="text-xs">{message}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={containerClass}>
      <Image
        isBlurred
        isZoomed
        alt={alt}
        className="object-cover"
        height={height}
        isLoading={isLoading}
        radius="lg"
        src={src}
        width={width}
      />
    </div>
  )
}
