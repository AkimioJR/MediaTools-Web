import api from '@/services/api'
import { type RecognizeMediaDetail } from '@/types'

export const RecognizeService = {
  async RecognizeMedia(title: string): Promise<RecognizeMediaDetail> {
    return await api.get('/recognize/media', { params: { title } })
  },
}
