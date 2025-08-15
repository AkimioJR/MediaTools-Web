import type { LogDetail } from '@/types/log'

import { Card, CardBody, CardHeader } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { Button } from '@heroui/button'
import { Select, SelectItem } from '@heroui/select'
import { Input } from '@heroui/input'
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
  RefreshCw,
  AlertCircle,
  Circle,
  Search,
  Settings2,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

import { LogService } from '@/services/log'
import { handleApiError } from '@/utils/message'

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('today')
  const [searchValue, setSearchValue] = useState('')

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
    <div className="p-4 space-y-8">
      {/* 统计信息卡片 */}
      <Card radius="lg" shadow="sm">
        <CardBody className="p-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-content1 rounded-xl p-4 border border-divider hover:shadow-md transition-all duration-200"
              >
                <div className="text-xs font-medium text-foreground-500 mb-1">
                  {stat.label}
                </div>
                <div
                  className={`text-lg font-bold ${
                    stat.color === 'primary'
                      ? 'text-primary'
                      : stat.color === 'success'
                        ? 'text-success'
                        : stat.color === 'warning'
                          ? 'text-warning'
                          : stat.color === 'danger'
                            ? 'text-danger'
                            : 'text-foreground'
                  }`}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* 工具栏卡片 */}
      <Card radius="lg" shadow="sm">
        <CardBody className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* 左侧：搜索和选择器 */}
            <div className="flex flex-col sm:flex-row gap-3 flex-1 min-w-0">
              {/* 搜索框 */}
              <Input
                className="w-full sm:w-80"
                classNames={{
                  input: 'bg-transparent',
                  inputWrapper:
                    'bg-content2 hover:bg-content3 transition-colors duration-200 border-0 shadow-sm',
                }}
                placeholder="搜索..."
                radius="lg"
                startContent={
                  <Search className="w-4 h-4 text-foreground-400" />
                }
                value={searchValue}
                variant="flat"
                onValueChange={setSearchValue}
              />

              {/* 时间范围选择器 */}
              <Select
                aria-label="时间范围"
                className="w-full sm:w-48"
                classNames={{
                  trigger:
                    'bg-content2 hover:bg-content3 border-0 shadow-sm transition-colors duration-200',
                }}
                placeholder="选择时间范围"
                radius="lg"
                selectedKeys={timeRange ? [timeRange] : []}
                variant="flat"
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0] as string

                  setTimeRange(key)
                }}
              >
                <SelectItem key="today">今天</SelectItem>
                <SelectItem key="week">本周</SelectItem>
                <SelectItem key="month">本月</SelectItem>
                <SelectItem key="year">本年</SelectItem>
              </Select>
            </div>

            {/* 右侧：操作按钮 */}
            <div className="flex flex-wrap gap-3 shrink-0">
              <Button
                className="font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
                radius="lg"
                size="md"
                startContent={<RefreshCw className="w-4 h-4" />}
                variant="bordered"
                onPress={handleRefresh}
              >
                刷新
              </Button>
              <Button
                className="font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
                radius="lg"
                size="md"
                startContent={<Settings2 className="w-4 h-4" />}
                variant="bordered"
                onPress={handleSettings}
              >
                设置
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

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
                            {log.caller}
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
