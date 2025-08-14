import api from '@/services/api'

export const TMDBService = {
  ImageService: {
    /**
     * 获取海报图像
     * @param media_type 媒体类型
     * @param tmdb_id TMDB ID
     * @returns 海报图像的URL
     */
    async GetPosterImage(media_type: string, tmdb_id: number): Promise<string> {
      return await api.get(`/tmdb/image/poster/${media_type}/${tmdb_id}`)
    },
  },

  /**
   * 获取媒体详情
   * @param media_type 媒体类型
   * @param tmdb_id TMDB ID
   * @returns 媒体详情
   */
  async GetOverview(media_type: string, tmdb_id: number): Promise<string> {
    return await api.get(`/tmdb/overview/${media_type}/${tmdb_id}`)
  },
}
