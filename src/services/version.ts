import type { VersionInfo } from '@/types'

import api from './api'

export const versionService = {
  async getVersionInfo(): Promise<VersionInfo> {
    return await api.get('/version')
  },
}
