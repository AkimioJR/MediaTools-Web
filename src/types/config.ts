import { TransferType } from './storage'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

// 日志配置接口
export interface LogConfig {
  console_level: LogLevel // 控制台日志级别
  file_level: LogLevel // 文件日志级别
  file_dir: string // 日志文件目录
}

// TMDB 配置接口
export interface TMDBConfig {
  api_url: string // TMDB API 地址
  image_url: string // TMDB 图片地址
  api_key: string // TMDB API 密钥
  language: string // 语言设置
  include_image_language: string // 包含的图片语言
}

// Fanart 配置接口
export interface FanartConfig {
  api_key: string // Fanart API 密钥
  api_url: string // Fanart API 地址
  languages: string[] // 语言顺序
}

// 媒体格式配置接口
export interface FormatConfig {
  movie: string // 电影格式
  tv: string // 电视剧格式
}

// 自定义识别词配置接口
export interface CustomWordConfig {
  identify_word: string[] // 自定义识别词
  customization: string[] // 自定义占位词
  exclude_words: string[] // 自定义排除词
}

// 媒体库配置接口
export interface LibraryConfig {
  name: string // 媒体库名称
  src_path: string // 源路径
  src_type: string // 源类型
  dst_type: string // 目标类型
  dst_path: string // 目标路径
  transfer_type: TransferType // 传输类型
  organize_by_type: boolean // 是否按类型分文件夹
  organize_by_category: boolean // 是否按分类分文件夹
  scrape: boolean // 是否刮削
  notify: boolean // 是否通知
}

// 媒体配置接口
export interface MediaConfig {
  libraries: LibraryConfig[] // 媒体库路径列表
  format: FormatConfig // 媒体格式配置
  custom_word: CustomWordConfig // 自定义识别词配置
}

// 主配置接口
export interface Configuration {
  log: LogConfig // 日志配置
  tmdb: TMDBConfig // TMDB 配置
  fanart: FanartConfig // Fanart 配置
  media: MediaConfig // 媒体配置
}
