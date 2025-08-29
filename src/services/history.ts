import type { StorageType, TransferType, MediaTransferHistory } from '@/types'

import api from './api'

export interface MediaHistoryQueryOptions {
  id?: number // 数据库主键ID,若传入则至多返回一条记录
  startTime?: string // 开始时间，RFC3339 格式
  endTime?: string // 结束时间，RFC3339 格式
  storageType?: StorageType // 存储类型
  path?: string // 路径，模糊匹配
  transferType?: TransferType // 传输类型
  status?: boolean // 传输状态，true 成功，false 失败
  count?: number // 返回记录数，默认 50
  page?: number // 页码，默认 1
}

export const HistoryService = {
  MediaHistoryService: {
    async GetMediaTransferHistory(
      options: MediaHistoryQueryOptions = {},
    ): Promise<MediaTransferHistory[]> {
      const {
        id,
        startTime,
        endTime,
        storageType,
        path,
        transferType,
        status,
        count = 50,
        page = 1,
      } = options || {}

      const isDefined = (v: unknown) => v !== undefined && v !== null

      let params: Record<string, unknown> = {}

      if (isDefined(id)) {
        params = { id }
      } else {
        const candidateParams: Record<string, unknown> = {
          start_time: startTime,
          end_time: endTime,
          storage_type: storageType,
          path,
          transfer_type: transferType,
          status,
          count,
          page,
        }

        params = Object.fromEntries(
          Object.entries(candidateParams).filter(([, value]) =>
            isDefined(value),
          ),
        )
      }

      return await api.get('/history/media', { params })
    },
  },
}
