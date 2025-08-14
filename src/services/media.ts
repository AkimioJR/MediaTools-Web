import api from '@/services/api'
import { type MediaItem } from '@/types'

export const MediaService = {
  async Recognize(title: string): Promise<MediaItem> {
    return await api.get('/media/recognize', { params: { title } })
  },
}
