import api from './api'
import type { VersionInfo } from '@/types'

export const versionService = {
  async getVersionInfo(): Promise<VersionInfo> {
    return await api.get('/version')
  },
}
