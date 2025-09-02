import type { StorageType, TransferType } from './storage'
import type { MediaItem } from './media'

export interface MediaTransferHistory {
  id: number // 数据库主键ID
  updated_at: string // 更新时间
  src_type: StorageType // 源存储类型
  src_path: string // 源路径
  dst_type: StorageType // 目标存储类型
  dst_path: string // 目标路径
  transfer_type: TransferType // 传输类型
  status: boolean // true 成功，false 失败
  message: string // 失败时的错误信息
  item: MediaItem // 关联的媒体项
}
