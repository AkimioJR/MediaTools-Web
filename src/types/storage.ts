export type StorageType = 'UnknownStorage' | 'LocalStorage'
export type FileType = 'UnknownFileType' | 'File' | 'Directory'
export type TransferType =
  | 'UnknownTransferType'
  | 'Copy'
  | 'Move'
  | 'Link'
  | 'SoftLink'

export interface StorageProviderInterface {
  storage_type: StorageType
  transfer_type: TransferType[]
}

export interface StorageFileInfo {
  storage_type: StorageType
  path: string
  name: string
  ext: string
  type: FileType

  // detail 才有以下属性
  size?: number
  mod_time?: string
}

export interface StorageProvider {
  id: string
  name: string
  type: StorageType
  config: Record<string, any>
  status: 'active' | 'inactive' | 'error'
}

export interface FileOperation {
  id: string
  operation: 'copy' | 'move' | 'delete' | 'rename'
  source: string
  destination?: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  error?: string
}

export interface StorageStats {
  total_space: number
  used_space: number
  free_space: number
  file_count: number
  folder_count: number
}
