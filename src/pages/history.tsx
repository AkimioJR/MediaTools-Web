import type { MediaTransferHistory } from '@/types'

import { Card, CardBody } from '@heroui/card'
import { Info, Film, Tv } from 'lucide-react'
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
import { Button } from '@heroui/button'

import { HistoryService } from '@/services/history'
import { showError } from '@/components/toast-provider'
import { Icon } from '@/components/icon'
import { useModal } from '@/components/modal-provider'
import DetailModal from '@/ui/history/DetailModal'

interface ColumnDef {
  key: string
  label: string
  className?: string
}

const TABLE_COLUMNS: ColumnDef[] = [
  { key: 'name', label: '名称', className: '' },
  { key: 'path', label: '路径', className: 'hidden sm:table-cell' },
  { key: 'type', label: '类型', className: 'hidden sm:table-cell' },
  {
    key: 'status',
    label: '状态',
    className: 'w-24 hidden sm:table-cell',
  },
  {
    key: 'detail',
    label: '详情',
    className: '',
  },
]

const PAGE_SIZES = [20, 50, 100]

export default function HistoryPage() {
  const [items, setItems] = useState<MediaTransferHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(50)
  const { openModal } = useModal()
  const canNext = items.length >= pageSize
  const totalPages = Math.max(1, page + (canNext ? 1 : 0))
  const isMovie = (item: MediaTransferHistory) =>
    item.item.media_type === 'Movie'

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const data =
        await HistoryService.MediaHistoryService.QueryMediaTransferHistories({
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

  const handleOpenDetailModal = useCallback(
    (row: MediaTransferHistory) => {
      openModal(
        (close) => <DetailModal row={row} onClose={() => close(undefined)} />,
        {
          title: '转移详情',
          size: window.innerWidth > 768 ? '3xl' : undefined,
        },
      )
    },
    [openModal],
  )

  return (
    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
      <Card radius="lg" shadow="sm">
        <CardBody className="p-3 sm:p-4">工具栏</CardBody>
      </Card>

      <Card radius="lg" shadow="sm">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <Table
              removeWrapper
              aria-label="转移历史列表"
              classNames={{
                th: 'bg-default-100 text-xs sm:text-sm',
                td: 'py-2 sm:py-3 text-xs sm:text-sm align-middle',
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
                            <TableCell className="max-w-[24rem]">
                              <div className="flex items-center gap-2">
                                <Icon icon={isMovie(row) ? Film : Tv} />
                                {row.item.title}
                                <span className="text-foreground-500">
                                  {isMovie(row)
                                    ? row.item.year
                                    : row.item.season_str +
                                      row.item.episode_str}
                                </span>
                                <Chip
                                  className="sm:hidden ml-2"
                                  color={row.status ? 'success' : 'danger'}
                                  size="sm"
                                  variant="flat"
                                >
                                  {row.status ? '成功' : '失败'}
                                </Chip>
                              </div>
                            </TableCell>
                          )
                        case 'path': {
                          const src = `${row.src_path}`
                          const dest = `${row.dst_path}`

                          return (
                            <TableCell className="max-w-[24rem] hidden sm:table-cell">
                              <div className="flex flex-col">
                                <div className="font-medium truncate">
                                  {src}
                                </div>
                                <div className="text-foreground-500">to</div>
                                <div className="font-medium truncate">
                                  {dest}
                                </div>
                              </div>
                            </TableCell>
                          )
                        }
                        case 'type':
                          return (
                            <TableCell className="hidden sm:table-cell">
                              <span className="">{row.transfer_type}</span>
                            </TableCell>
                          )
                        case 'status':
                          return (
                            <TableCell className="w-24 hidden sm:table-cell">
                              <Chip
                                color={row.status ? 'success' : 'danger'}
                                size="sm"
                                variant="flat"
                              >
                                {row.status ? '成功' : '失败'}
                              </Chip>
                            </TableCell>
                          )
                        case 'detail':
                          return (
                            <TableCell className="">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => {
                                  handleOpenDetailModal(row)
                                }}
                              >
                                <Icon icon={Info} />
                              </Button>
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
