import type { StorageType, TransferType, MediaTransferHistory } from '@/types'

import api from './api'

export const HistoryService = {
  MediaHistoryService: {
    async GetMediaTransferHistory(
      id: number | undefined, // 数据库主键ID,若传入则至多返回一条记录
      start_time: string | undefined, // 开始时间，RFC3339 格式
      end_time: string | undefined, // 结束时间，RFC3339 格式
      storage_type: StorageType | undefined, // 存储类型
      path: string | undefined, // 路径，模糊匹配
      transfer_type: TransferType | undefined, // 传输类型
      status: boolean | undefined, // 传输状态，true 成功，false 失败
      count: number | undefined = 30, // 返回记录数，默认 30
    ): Promise<MediaTransferHistory[]> {
      var params: Record<string, any> = {}
      if (id !== undefined) {
        params['id'] = id
      } else {
        if (start_time !== undefined) {
          params['start_time'] = start_time
        }
        if (end_time !== undefined) {
          params['end_time'] = end_time
        }
        if (storage_type !== undefined) {
          params['storage_type'] = storage_type
        }
        if (path !== undefined) {
          params['path'] = path
        }
        if (transfer_type !== undefined) {
          params['transfer_type'] = transfer_type
        }
        if (status !== undefined) {
          params['status'] = status
        }
        if (count !== undefined) {
          params['count'] = count
        }
      }
      return await api.get('/history/media', { params })
    },
  },
}
