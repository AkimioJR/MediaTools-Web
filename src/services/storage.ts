import api from '@/services/api'
import { type StorageProviderInterface, type FileInfo } from '@/types'

export const StorageService = {
  ProviderService: {
    async getProviderList(): Promise<StorageProviderInterface[]> {
      return await api.get('/storage/provider')
    },

    async getProvider(storage_type: string): Promise<StorageProviderInterface> {
      return await api.get(`/storage/provider/${storage_type}`)
    },

    async updateProvider(
      storage_type: string,
      data: Record<string, string>,
    ): Promise<StorageProviderInterface> {
      return await api.post('/storage/provider', {
        storage_type,
        data,
      })
    },

    async deleteProvider(
      storage_type: string,
    ): Promise<StorageProviderInterface> {
      return await api.delete(`/storage/provider/${storage_type}`)
    },
  },

  async CheckExists(storage_type: string, path: string): Promise<boolean> {
    return await api.get(`/storage/${storage_type}/exists`, {
      params: { path },
    })
  },

  async List(storage_type: string, path: string): Promise<FileInfo[]> {
    return await api.get(`/storage/${storage_type}/list`, {
      params: { path },
    })
  },

  async Mkdir(storage_type: string, path: string): Promise<FileInfo> {
    return await api.post(`/storage/${storage_type}/mkdir`, {
      path,
    })
  },

  async Rename(
    storage_type: string,
    path: string,
    new_name: string,
  ): Promise<FileInfo> {
    return await api.post(`/storage/${storage_type}/rename`, {
      path,
      new_name,
    })
  },

  async Delete(storage_type: string, path: string): Promise<FileInfo> {
    return await api.delete(`/storage/${storage_type}/delete`, {
      data: { path },
    })
  },

  async Copy(
    src_storage_type: string,
    src_path: string,
    dest_storage_type: string,
    dest_path: string,
  ): Promise<FileInfo> {
    return await api.post(`/storage/${src_storage_type}/copy`, {
      src: { path: src_path, storage_type: src_storage_type },
      dest: { path: dest_path, storage_type: dest_storage_type },
    })
  },

  async Move(
    src_storage_type: string,
    src_path: string,
    dest_storage_type: string,
    dest_path: string,
  ): Promise<FileInfo> {
    return await api.post(`/storage/${src_storage_type}/move`, {
      src: { path: src_path, storage_type: src_storage_type },
      dest: { path: dest_path, storage_type: dest_storage_type },
    })
  },

  async Link(
    src_storage_type: string,
    src_path: string,
    dest_storage_type: string,
    dest_path: string,
  ): Promise<FileInfo> {
    return await api.post(`/storage/${src_storage_type}/link`, {
      src: { path: src_path, storage_type: src_storage_type },
      dest: { path: dest_path, storage_type: dest_storage_type },
    })
  },

  async SoftLink(
    src_storage_type: string,
    src_path: string,
    dest_storage_type: string,
    dest_path: string,
  ): Promise<FileInfo> {
    return await api.post(`/storage/${src_storage_type}/softlink`, {
      src: { path: src_path, storage_type: src_storage_type },
      dest: { path: dest_path, storage_type: dest_storage_type },
    })
  },

  async Transfer(
    src_storage_type: string,
    src_path: string,
    dest_storage_type: string,
    dest_path: string,
    transfer_type: string = 'copy',
  ): Promise<FileInfo> {
    return await api.post(`/storage/${src_storage_type}/transfer`, {
      src: { path: src_path, storage_type: src_storage_type },
      dest: { path: dest_path, storage_type: dest_storage_type },
      transfer_type,
    })
  },

  async Upload(
    storage_type: string,
    path: string,
    file: File,
    onUploadProgress?: (progressEvent: any) => void,
  ): Promise<FileInfo> {
    const formData = new FormData()

    formData.append('path', path)
    formData.append('file', file)

    return await api.post(`/storage/${storage_type}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
  },

  async Download(storage_type: string, path: string): Promise<Blob> {
    return await api.get(`/storage/${storage_type}/download`, {
      params: { path },
      responseType: 'blob', // 重要：指定响应类型为 blob
    })
  },

  // 下载文件并触发浏览器下载
  async DownloadFile(
    storage_type: string,
    path: string,
    filename?: string,
  ): Promise<void> {
    const blob = await this.Download(storage_type, path)

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url

    // 如果没有指定文件名，从路径中提取
    const downloadFilename = filename || path.split('/').pop() || 'download'

    link.download = downloadFilename

    // 触发下载
    document.body.appendChild(link)
    link.click()

    // 清理
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  },
}
