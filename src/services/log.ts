import type { LogDetail } from '@/types/log'

import api from './api'

export const LogService = {
  async GetRecentLogs(): Promise<LogDetail[]> {
    return await api.get('/log/recent')
  },
}
