import { MediaType } from '@/types'

const MEDIA_TYPE_OPTIONS: { label: string; value: MediaType }[] = [
  { label: '自动识别', value: 'UnknownMediaType' },
  { label: '电影', value: 'Movie' },
  { label: '电视剧', value: 'TV' },
] as const

const MAX_EPISODE_NUMBER = 500

const MAX_SEASON_NUMBER = 100

export { MEDIA_TYPE_OPTIONS, MAX_EPISODE_NUMBER, MAX_SEASON_NUMBER }
