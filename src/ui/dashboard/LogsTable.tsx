import type { LogDetail } from '@/types/log'

import { Card, CardBody, CardHeader } from '@heroui/card'
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
import { Activity, RefreshCw, AlertCircle, Circle } from 'lucide-react'

export function LogsTable({
  logs,
  loading,
  error,
  onRefresh,
  getLogLevelColor,
  getLogLevelText,
  formatTime,
}: {
  logs: LogDetail[]
  loading: boolean
  error: string
  onRefresh: () => void
  getLogLevelColor: (level: string) => any
  getLogLevelText: (level: string) => string
  formatTime: (time: string) => string
}) {
  return (
    <Card radius="lg" shadow="sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
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
              onPress={onRefresh}
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
              th: 'bg-default-100 text-xs sm:text-sm',
              td: 'py-2 text-xs sm:text-sm',
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
                    <span className="text-xs sm:text-sm text-foreground-500">
                      {formatTime(log.time)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs sm:max-w-md">
                      <p className="text-xs sm:text-sm">{log.message}</p>
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
  )
}
