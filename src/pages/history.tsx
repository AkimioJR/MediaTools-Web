import type { MediaTransferHistory } from '@/types'

import { Card, CardBody } from '@heroui/card'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/table'
import { Chip } from '@heroui/chip'
import { Select, SelectItem } from '@heroui/select'
import { Pagination } from '@heroui/pagination'
import { Spinner } from '@heroui/spinner'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { HistoryService } from '@/services/history'
import { showError } from '@/components/toast-provider'

interface ColumnDef {
  key: string
  label: string
  className?: string
}

const TABLE_COLUMNS: ColumnDef[] = [
  { key: 'name', label: '名称', className: 'hidden sm:table-cell' },
  { key: 'path', label: '路径', className: '' },
  { key: 'type', label: '类型', className: 'hidden sm:table-cell' },
  { key: 'status', label: '状态', className: 'w-24 sm:w-28 text-center' },
  {
    key: 'message',
    label: '消息',
    className: 'hidden sm:table-cell text-center',
  },
]

const PAGE_SIZES = [20, 50, 100]

function formatDate(value?: string): string {
  if (!value) return ''
  try {
    return new Date(value).toLocaleString('zh-CN')
  } catch {
    return value
  }
}

function truncate(text: string, max = 48): string {
  if (text.length <= max) return text

  return text.slice(0, max - 1) + '…'
}

export default function HistoryPage() {
  const [items, setItems] = useState<MediaTransferHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(50)

  const canNext = items.length >= pageSize
  const totalPages = Math.max(1, page + (canNext ? 1 : 0))

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data =
        await HistoryService.MediaHistoryService.GetMediaTransferHistory({
          page,
          count: pageSize,
        })

      setItems(data)
    } catch (e) {
      setItems([])
      showError('获取转移历史失败:' + e)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const pageSizeOptions = useMemo(
    () => PAGE_SIZES.map((n) => ({ key: String(n), label: `${n}/页` })),
    [],
  )

  return (
    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
      {/* 工具栏：保留空位 */}
      <Card radius="lg" shadow="sm">
        <CardBody className="p-3 sm:p-4">工具栏</CardBody>
      </Card>

      {/* 列表 */}
      <Card radius="lg" shadow="sm">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <Table
              removeWrapper
              aria-label="转移历史列表"
              classNames={{
                th: 'bg-default-100 text-xs sm:text-sm',
                td: 'py-2 sm:py-3 text-xs sm:text-sm align-top',
              }}
            >
              <TableHeader columns={TABLE_COLUMNS}>
                {(column) => (
                  <TableColumn key={column.key} className={column.className}>
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                emptyContent="暂无记录"
                isLoading={loading}
                items={items}
                loadingContent={<Spinner label="加载中..." />}
              >
                {(row) => (
                  <TableRow key={row.id} className="group hover:bg-content2">
                    {(columnKey) => {
                      switch (columnKey) {
                        case 'name':
                          return (
                            <TableCell className="hidden sm:table-cell whitespace-nowrap">
                              <span className="text-foreground-500">
                                {row.media_item.title}
                              </span>
                            </TableCell>
                          )
                        case 'path': {
                          const src = `${row.src_type}:${row.src_path}`
                          const dest = `${row.dest_type}:${row.dest_path}`

                          return (
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="font-medium truncate">
                                  {truncate(src, 56)}
                                </div>
                                <div className="text-foreground-500 truncate">
                                  → {truncate(dest, 56)}
                                </div>
                                <div className="sm:hidden text-foreground-500 text-[11px] mt-1">
                                  {formatDate(row.updated_at)}
                                </div>
                              </div>
                            </TableCell>
                          )
                        }
                        case 'type':
                          return (
                            <TableCell className="hidden sm:table-cell">
                              <span className="uppercase tracking-wide text-xs">
                                {row.transfer_type}
                              </span>
                            </TableCell>
                          )
                        case 'status':
                          return (
                            <TableCell className="w-24 sm:w-28">
                              <Chip
                                color={row.status ? 'success' : 'danger'}
                                size="sm"
                                variant="flat"
                              >
                                {row.status ? '成功' : '失败'}
                              </Chip>
                            </TableCell>
                          )
                        case 'message':
                          return (
                            <TableCell className="hidden sm:table-cell max-w-[24rem]">
                              <span className="text-foreground-500">
                                {row.message ? truncate(row.message, 120) : ''}
                              </span>
                            </TableCell>
                          )
                        default:
                          return <TableCell>{''}</TableCell>
                      }
                    }}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardBody>
      </Card>

      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground-500 hidden sm:inline">
            每页条数
          </span>
          <Select
            className="w-[120px]"
            selectedKeys={new Set([String(pageSize)])}
            size="sm"
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0] as string | undefined
              const n = key ? parseInt(key) : pageSize

              setPage(1)
              setPageSize(n)
            }}
          >
            {pageSizeOptions.map((opt) => (
              <SelectItem key={opt.key}>{opt.label}</SelectItem>
            ))}
          </Select>
        </div>

        <Pagination
          isCompact
          showControls
          page={page}
          total={totalPages}
          onChange={setPage}
        />
      </div>
    </div>
  )
}
