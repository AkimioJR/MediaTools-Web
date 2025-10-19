export interface RuntimeAppStatusInfo {
    desktop_mode: boolean // 当前是否运行桌面模式
    is_dev: boolean // 当前是否为开发模式
    port: number // 当前运行端口（桌面模式下为 0）
    boot_time: string // 程序启动时间，RFC3339 字符串
    os: string // 操作系统
    arch: string // 架构
}
