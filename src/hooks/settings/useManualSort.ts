import type { StorageFileInfo } from '@/types/storage'
import type { MediaType, StorageType, TransferType } from '@/types'

import { useCallback, useState } from 'react'

import { LibraryService } from '@/services/library'
import { handleApiError, showSuccess } from '@/utils/message'

type UseManualSortParams = {
  file: StorageFileInfo
  destinationValue: string
  onSubmitSuccess: () => void
}

export function useManualSort(params: UseManualSortParams) {
  const { file, destinationValue, onSubmitSuccess } = params
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsLoading(true)

      const entries = Object.fromEntries(
        new FormData(e.currentTarget),
      ) as Record<string, FormDataEntryValue>

      const getString = (key: string, fallback = ''): string => {
        const value = entries[key]

        if (!value) return fallback

        return typeof value === 'string' ? value : fallback
      }

      const getInt = (key: string, fallback = 0): number => {
        const raw = getString(key, '')
        const n = parseInt(raw, 10)

        return Number.isFinite(n) ? n : fallback
      }

      try {
        const src_storage_type = file.storage_type as StorageType
        const src_path = file.path

        const dst_storage_type = getString('dst_storage_type') as StorageType
        const dst_path = getString('dst_path', destinationValue)
        const transfer_type = getString('transfer_type') as TransferType

        const organize_by_type =
          getString('organize_by_type', 'false') === 'true'
        const organize_by_category =
          getString('organize_by_category', 'false') === 'true'
        const scrape = getString('scrape', 'false') === 'true'

        const media_type = getString('media_type') as MediaType
        const tmdb_id = getInt('tmdb_id', 0)
        const season = entries.season ? getInt('season', -1) : -1
        const episode_str = getString('episode_str', '')
        const episode_offset = getString('episode_offset', '')
        const part = getString('part', '')
        const episode_format = getString('episode_format', '')

        await LibraryService.ArchiveMediaManual(
          src_storage_type,
          src_path,
          dst_storage_type,
          dst_path,
          transfer_type,
          organize_by_type,
          organize_by_category,
          scrape,
          media_type,
          tmdb_id,
          season,
          episode_str,
          episode_offset,
          part,
          episode_format,
        )

        showSuccess('已加入整理队列')
        onSubmitSuccess()
      } catch (error) {
        handleApiError('加入整理队列失败:' + error)
      } finally {
        setIsLoading(false)
      }
    },
    [file, destinationValue, onSubmitSuccess],
  )

  return { handleSubmit, isLoading }
}
