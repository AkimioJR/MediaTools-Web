import type { RuntimeAppStatusInfo } from '@/types'

import api from './api'

export const runtimeService = {
  async getRuntimeAppStatusInfo(): Promise<RuntimeAppStatusInfo> {
    return await api.get('/runtime/status')
  },
}
