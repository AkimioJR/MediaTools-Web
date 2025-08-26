import type { Task, StorageType, TransferType, MediaType } from '@/types'

import api from './api'

export const LibraryService = {
  async ArchiveMediaManual(
    src_storage_type: StorageType,
    src_path: string,
    dst_storage_type: StorageType,
    dst_path: string,
    transfer_type: TransferType,
    organize_by_type: boolean,
    organize_by_category: boolean,
    scrape: boolean,

    media_type: MediaType = 'UnknownMediaType', // UnknownMediaType 表示不指定类型
    tmdb_id: number = 0, // 0 表示不指定 TMDB ID
    season: number = -1, // -1 表示不指定季数
    episode_str: string = '', // 空字符串表示不指定集数
    episode_offset: string = '', // 空字符串表示不指定集数偏移
    part: string = '', // 空字符串表示不指定分段
    episode_format: string = '', // 空字符串表示不指定集数格式
  ): Promise<Task> {
    const src_file = {
      storage_type: src_storage_type,
      path: src_path,
    }
    const dst_dir = {
      storage_type: dst_storage_type,
      path: dst_path,
    }

    return await api.post('/library/archive', {
      src_file,
      dst_dir,
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
    })
  },
}
