export interface StorageProviderInterface {
  storage_type: string
  transfer_type: string[]
}

export interface FileInfo {
  storage_type: string
  path: string
  name: string
  ext: string
  size: number
  is_dir: boolean
  mod_time: string
}

export interface StorageProvider {
  id: string
  name: string
  type: string
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
