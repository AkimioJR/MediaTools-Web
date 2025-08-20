export interface VersionInfo {
  app_version: string // 应用版本号
  commit_hash: string // 提交哈希
  build_time: string | 'Unknown' // 构建时间，如果未知则为 'Unknown'，默认是 RFC3339 字符串
  go_version: string // Go 版本
  os: string // 操作系统
  arch: string // 架构
}
