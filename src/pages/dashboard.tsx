import type { LogDetail } from '@/types/log'

import { Card, CardBody, CardHeader } from '@heroui/card'
import { Progress } from '@heroui/progress'
import { Chip } from '@heroui/chip'
import { Button } from '@heroui/button'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/table'
import { Spinner } from '@heroui/spinner'
import {
  Activity,
  HardDrive,
  Cpu,
  Wifi,
  Users,
  FileText,
  RefreshCw,
  AlertCircle,
  Circle,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

import { PageToolbar, toolbarPresets } from '@/components/page-toolbar'
import { LogService } from '@/services/log'
import { handleApiError } from '@/utils/message'

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('today')

  // 日志相关状态
  const [logs, setLogs] = useState<LogDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 模拟数据
  const stats = [
    { label: '总文件数', value: '1,234' },
    { label: '存储使用', value: '85%', color: 'warning' as const },
    { label: '活跃用户', value: '23', color: 'success' as const },
    { label: '今日处理', value: '156', color: 'primary' as const },
  ]

  const systemMetrics = [
    {
      name: 'CPU 使用率',
      value: 65,
      color: 'primary',
      icon: <Cpu className="w-4 h-4" />,
    },
    {
      name: '内存使用',
      value: 78,
      color: 'warning',
      icon: <Activity className="w-4 h-4" />,
    },
    {
      name: '磁盘空间',
      value: 45,
      color: 'success',
      icon: <HardDrive className="w-4 h-4" />,
    },
    {
      name: '网络状态',
      value: 92,
      color: 'success',
      icon: <Wifi className="w-4 h-4" />,
    },
  ]

  const handleRefresh = () => {
    console.log('刷新数据')
  }

  const handleSettings = () => {
    console.log('打开设置')
  }

  // 日志等级颜色映射
  const getLogLevelColor = (level: string) => {
    const colorMap: Record<
      string,
      'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
    > = {
      trace: 'default',
      debug: 'primary',
      info: 'success',
      warning: 'warning',
      error: 'danger',
    }

    return colorMap[level] || 'default'
  }

  // 日志等级文本映射
  const getLogLevelText = (level: string) => {
    const textMap: Record<string, string> = {
      trace: '跟踪',
      debug: '调试',
      info: '信息',
      warning: '警告',
      error: '错误',
    }

    return textMap[level] || level.toUpperCase()
  }

  // 格式化时间显示
  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr)

      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } catch {
      return timeStr
    }
  }

  // 获取日志数据
  const fetchLogs = async () => {
    if (loading) return

    setLoading(true)
    setError('')

    try {
      const logData = await LogService.GetRecentLogs()

      setLogs(logData || [])
    } catch (err) {
      setError('获取日志失败: ' + (err as Error).message)
      handleApiError(err, '获取日志失败')
      setLogs([]) // 出错时设置为空数组
    } finally {
      setLoading(false)
    }
  }

  // 手动刷新日志
  const handleRefreshLogs = () => {
    fetchLogs()
  }

  // 设置定时刷新日志
  useEffect(() => {
    // 立即获取一次
    fetchLogs()

    // 设置定时器，每5秒刷新一次
    intervalRef.current = setInterval(() => {
      fetchLogs()
    }, 5000)

    // 清理函数
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, []) // 空依赖数组，只在组件挂载时执行一次

  return (
    <div className="p-6 space-y-8 min-h-screen">
      {/* 页面工具栏 */}
      <PageToolbar
        actions={[
          {
            ...toolbarPresets.dashboard.actions[0],
            onPress: handleRefresh,
          },
          {
            ...toolbarPresets.dashboard.actions[1],
            onPress: handleSettings,
          },
        ]}
        selects={[
          {
            ...toolbarPresets.dashboard.selects[0],
            selectedKey: timeRange,
            onSelectionChange: setTimeRange,
          },
        ]}
        stats={stats}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 系统指标 */}
        <div className="lg:col-span-2">
          <Card className="h-full" radius="lg" shadow="sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">系统指标</h3>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {systemMetrics.map((metric) => (
                  <div key={metric.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {metric.icon}
                        <span className="text-sm font-medium">
                          {metric.name}
                        </span>
                      </div>
                      <span className="text-sm text-foreground-500">
                        {metric.value}%
                      </span>
                    </div>
                    <Progress
                      aria-label={metric.name}
                      className="w-full"
                      color={metric.color as any}
                      size="sm"
                      value={metric.value}
                    />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 快速操作 */}
        <div>
          <Card className="h-full" radius="lg" shadow="sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">快速操作</h3>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-3">
                <Card
                  isPressable
                  className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-none shadow-sm hover:shadow-md transition-all duration-200"
                  radius="lg"
                >
                  <CardBody className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">用户管理</h4>
                        <p className="text-xs text-foreground-500">
                          管理系统用户
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card
                  isPressable
                  className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-none shadow-sm hover:shadow-md transition-all duration-200"
                  radius="lg"
                >
                  <CardBody className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                        <HardDrive className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">存储分析</h4>
                        <p className="text-xs text-foreground-500">
                          查看存储详情
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card
                  isPressable
                  className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-none shadow-sm hover:shadow-md transition-all duration-200"
                  radius="lg"
                >
                  <CardBody className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">性能监控</h4>
                        <p className="text-xs text-foreground-500">
                          系统性能分析
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* 系统日志 */}
      <Card radius="lg" shadow="sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">系统日志</h3>
            </div>
            <div className="flex items-center gap-2">
              {error ? (
                <Chip
                  color="danger"
                  size="sm"
                  startContent={<AlertCircle className="w-3 h-3" />}
                  variant="flat"
                >
                  获取失败
                </Chip>
              ) : (!logs || logs.length === 0) && !loading ? (
                <Chip
                  color="warning"
                  size="sm"
                  startContent={<Circle className="w-3 h-3" />}
                  variant="flat"
                >
                  暂无日志
                </Chip>
              ) : (
                <Chip color="success" size="sm" variant="flat">
                  实时更新
                </Chip>
              )}
              <Button
                isIconOnly
                isDisabled={loading}
                size="sm"
                variant="light"
                onPress={handleRefreshLogs}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="max-h-96 overflow-auto">
            <Table
              isStriped
              removeWrapper
              aria-label="系统日志"
              classNames={{
                wrapper: 'min-h-[200px]',
                th: 'bg-default-100',
                td: 'py-2',
              }}
            >
              <TableHeader>
                <TableColumn>等级</TableColumn>
                <TableColumn>时间</TableColumn>
                <TableColumn>内容</TableColumn>
              </TableHeader>
              <TableBody
                emptyContent={loading ? '加载中...' : '暂无日志数据'}
                isLoading={loading}
                loadingContent={<Spinner />}
              >
                {logs?.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Chip
                        color={getLogLevelColor(log.level)}
                        size="sm"
                        variant="flat"
                      >
                        {getLogLevelText(log.level)}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-foreground-500">
                        {formatTime(log.time)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm">{log.message}</p>
                        {log.caller && (
                          <p className="text-xs text-foreground-400 mt-1">
                            调用者: {log.caller}
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
