import type { LogDetail } from '@/types/log'

import { useState, useEffect, useRef } from 'react'

import { LogService } from '@/services/log'
import { handleApiError, showSuccess } from '@/utils/message'
import { StatsCards, LogsTable } from '@/ui/dashboard'

export default function DashboardPage() {
  const [logs, setLogs] = useState<LogDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const mockData = [
    { label: '总文件数', value: '1,234' },
    { label: '存储使用', value: '85%', color: 'warning' as const },
    { label: '活跃用户', value: '23', color: 'success' as const },
    { label: '今日处理', value: '156', color: 'primary' as const },
  ]

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
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshLogs = async () => {
    await fetchLogs()

    showSuccess('刷新成功')
  }

  useEffect(() => {
    fetchLogs()

    intervalRef.current = setInterval(() => {
      fetchLogs()
    }, 5000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  return (
    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
      {/* 统计信息 */}
      <StatsCards stats={mockData} />

      {/* 系统日志 */}
      <LogsTable
        error={error}
        formatTime={formatTime}
        getLogLevelColor={getLogLevelColor}
        getLogLevelText={getLogLevelText}
        loading={loading}
        logs={logs}
        onRefresh={handleRefreshLogs}
      />
    </div>
  )
}
