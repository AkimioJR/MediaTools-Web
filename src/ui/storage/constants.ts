import { MediaType } from '@/types'

const MEDIA_TYPE_OPTIONS: { label: string; value: MediaType }[] = [
  { label: '电影', value: 'Movie' },
  { label: '电视剧', value: 'TV' },
  { label: '未知类型', value: 'UnknownMediaType' },
] as const

const MAX_EPISODE_NUMBER = 500

const MAX_SEASON_NUMBER = 100

export { MEDIA_TYPE_OPTIONS, MAX_EPISODE_NUMBER, MAX_SEASON_NUMBER }
