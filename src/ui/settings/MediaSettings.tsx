import type { StorageProviderInterface, TransferType } from '@/types/storage'
import type { DragEndEvent } from '@dnd-kit/core'

import { Card, CardBody, CardHeader } from '@heroui/card'
import { Input, Textarea } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Button } from '@heroui/button'
import { Spinner } from '@heroui/spinner'
import { Tooltip } from '@heroui/tooltip'
import { Checkbox } from '@heroui/checkbox'
import { FileText, Video, Info, GripVertical } from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { useMediaConfig } from '@/hooks'
import { StorageService } from '@/services/storage'
import { LibraryConfig } from '@/types/config'

type SortableLibrary = LibraryConfig & { id: string }

export function MediaSettings() {
  const {
    formatConfig,
    customWordConfig,
    loading,
    loadFormatData,
    loadCustomWordData,
    updateFormatData,
    updateCustomWordData,
    setFormatConfig,
    setCustomWordConfig,

    libraries,
    setLibraries,
    loadLibrariesData,
    updateLibrariesData,
  } = useMediaConfig()

  const [sortableLibraries, setSortableLibraries] = useState<SortableLibrary[]>(
    [],
  )

  useEffect(() => {
    setSortableLibraries(
      libraries.map((lib, i) => ({
        ...lib,
        id: lib.name || String(i),
      })),
    )
  }, [libraries])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return

    setSortableLibraries((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id)
      const newIndex = prev.findIndex((item) => item.id === over.id)

      if (oldIndex === -1 || newIndex === -1) return prev

      const moved = arrayMove(prev, oldIndex, newIndex)

      setLibraries(moved.map(({ id: _, ...rest }) => rest))

      return moved
    })
  }

  const identifyWordHints: string[] = [
    '屏蔽词',
    '被替换词 => 替换词',
    '前定位词 <> 后定位词 >> 集偏移量（EP）',
    '被替换词 => 替换词 && 前定位词 <> 后定位词 >> 集偏移量（EP）',
    '（其中<被替换词>支持正则表达式，其余不支持，单独一个<被替换词>则会被替换为空字符串）',
  ]

  const [providers, setProviders] = useState<StorageProviderInterface[]>([])
  const [loadingProviders, setLoadingProviders] = useState(false)

  const transferTypeOptions: { label: string; value: TransferType }[] = [
    { label: '复制', value: 'Copy' },
    { label: '移动', value: 'Move' },
    { label: '硬链接', value: 'Link' },
    { label: '软链接', value: 'SoftLink' },
  ]

  const getAvailableTransferTypes = (srcType: string, dstType: string) => {
    if (srcType !== dstType) {
      return transferTypeOptions.filter(
        (t) => t.value === 'Copy' || t.value === 'Move',
      )
    }

    const provider = providers.find((p) => p.storage_type === srcType)
    const supported = provider?.transfer_type || ['Copy', 'Move']

    return transferTypeOptions.filter((t) => supported.includes(t.value))
  }

  const validateAndFixTransferType = (libIdx: number) => {
    setLibraries((prev) => {
      const next = [...prev]
      const lib = next[libIdx]

      if (!lib) return prev
      const available = getAvailableTransferTypes(lib.src_type, lib.dst_type)

      if (!available.some((t) => t.value === lib.transfer_type)) {
        lib.transfer_type = available[0]?.value || 'Copy'
      }

      return next
    })
  }

  const addLibrary = () => {
    const defaultType = providers[0]?.storage_type || ''
    const available = getAvailableTransferTypes(defaultType, defaultType)

    setLibraries((prev) => [
      ...prev,
      {
        name: '',
        src_path: '',
        src_type: defaultType,
        dst_type: defaultType,
        dst_path: '',
        transfer_type: (available[0]?.value || 'Copy') as TransferType,
        organize_by_type: false,
        organize_by_category: false,
        scrape: false,
        notify: false,
      },
    ])
  }

  const removeLibrary = (idx: number) => {
    setLibraries((prev) => prev.filter((_, i) => i !== idx))
  }

  useEffect(() => {
    loadFormatData()
    loadCustomWordData()
    loadLibrariesData()
  }, [loadFormatData, loadCustomWordData, loadLibrariesData])

  useEffect(() => {
    const loadProviders = async () => {
      setLoadingProviders(true)
      try {
        const list = await StorageService.ProviderService.getProviderList()

        setProviders(list)
      } finally {
        setLoadingProviders(false)
      }
    }

    loadProviders()
  }, [])

  const parseLines = (value: string) =>
    value.split(/\r?\n/).map((w) => w.trim())

  const ensureFormat = (prev: any) =>
    prev ? { ...prev } : { movie: '', tv: '' }

  const ensureCustomWord = (prev: any) =>
    prev
      ? { ...prev }
      : { identify_word: [], customization: [], exclude_words: [] }

  const toMultilineValue = (list?: string[]) =>
    list && list.length > 0 ? list.join('\n') : ''

  const updateCustomWordField = (
    field: 'identify_word' | 'customization' | 'exclude_words',
    value: string,
  ) => {
    const words = parseLines(value)

    setCustomWordConfig((prev) => ({
      ...ensureCustomWord(prev),
      [field]: words,
    }))
  }

  if (loading && !formatConfig && !customWordConfig) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner label="加载配置中..." />
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 媒体库重命名格式 */}
      <Card radius="lg" shadow="sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold">
              媒体库重命名格式
            </h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          <div className="space-y-6">
            <Textarea
              label="电影格式"
              placeholder="例如: {title} ({year})"
              value={formatConfig?.movie || ''}
              onValueChange={(value) =>
                setFormatConfig((prev) => ({
                  ...ensureFormat(prev),
                  movie: value,
                }))
              }
            />
            <Textarea
              label="电视剧格式"
              placeholder="例如: {title} S{season:02d}E{episode:02d}"
              value={formatConfig?.tv || ''}
              onValueChange={(value) =>
                setFormatConfig((prev) => ({
                  ...ensureFormat(prev),
                  tv: value,
                }))
              }
            />
          </div>
          <p className="text-xs sm:text-sm text-foreground-500">
            支持变量: {'{title}'}, {'{year}'}, {'{season}'}, {'{episode}'},{' '}
            {'{quality}'}
          </p>
          <div className="flex justify-end">
            <Button
              color="primary"
              isLoading={loading}
              onPress={updateFormatData}
            >
              {loading ? '保存中...' : '保存重命名格式'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* 自定义词条配置 */}
      <Card radius="lg" shadow="sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold">
              自定义词条配置
            </h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          <div className="flex items-start gap-2">
            <Textarea
              className="flex-1"
              label={
                <div className="flex items-center gap-2">
                  <p>自定义识别词</p>
                  <Tooltip
                    content={
                      <div className="text-xs space-y-1 max-w-xs">
                        {identifyWordHints.map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    }
                    placement="right"
                  >
                    <Info className="w-4 h-4 text-foreground-500" />
                  </Tooltip>
                </div>
              }
              maxRows={12}
              minRows={8}
              placeholder="输入自定义识别词，用逗号分隔"
              value={toMultilineValue(customWordConfig?.identify_word)}
              onValueChange={(value) =>
                updateCustomWordField('identify_word', value)
              }
            />
          </div>
          <Textarea
            description="用于电影/电视剧重命名的自定义词（每行一个，支持使用正则表达式，注意转义）"
            label="自定义词条"
            maxRows={12}
            minRows={8}
            placeholder="输入自定义占位词，用逗号分隔"
            value={toMultilineValue(customWordConfig?.customization)}
            onValueChange={(value) =>
              updateCustomWordField('customization', value)
            }
          />
          <Textarea
            description="路径中包含这些词的将不会自动转移（每行一个）"
            label="媒体库过滤词"
            placeholder="输入自定义排除词，用逗号分隔"
            value={toMultilineValue(customWordConfig?.exclude_words)}
            onValueChange={(value) =>
              updateCustomWordField('exclude_words', value)
            }
          />
          <div className="flex justify-end">
            <Button
              color="primary"
              isLoading={loading}
              onPress={updateCustomWordData}
            >
              {loading ? '保存中...' : '保存自定义词条配置'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* 媒体库配置 */}
      <Card radius="lg" shadow="sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold">媒体库配置</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button color="primary" onPress={addLibrary}>
              添加媒体库
            </Button>
          </div>

          {sortableLibraries.length === 0 ? (
            <div className="text-center py-8 text-foreground-500">
              暂无媒体库配置
            </div>
          ) : (
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToFirstScrollableAncestor]}
              sensors={sensors}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortableLibraries.map((lib) => lib.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {sortableLibraries.map((lib, idx) => (
                    <SortableLibraryItem key={lib.id} id={lib.id}>
                      <Card radius="lg" shadow="sm">
                        <CardBody className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-foreground-500" />
                              <span className="text-sm font-medium">
                                {lib.name || '未命名媒体库'}
                              </span>
                            </div>
                            <Button
                              color="danger"
                              size="sm"
                              variant="light"
                              onPress={() => removeLibrary(idx)}
                            >
                              删除
                            </Button>
                          </div>
                          <Input
                            label="名称"
                            value={lib.name}
                            onValueChange={(v) =>
                              setLibraries((prev) => {
                                const next = [...prev]

                                next[idx] = { ...next[idx], name: v }

                                return next
                              })
                            }
                          />

                          <Select
                            isDisabled={
                              loadingProviders || providers.length === 0
                            }
                            label="源存储类型"
                            selectedKeys={lib.src_type ? [lib.src_type] : []}
                            onSelectionChange={(keys) => {
                              const val = Array.from(keys)[0] as string

                              setLibraries((prev) => {
                                const next = [...prev]

                                next[idx] = {
                                  ...next[idx],
                                  src_type: val as any,
                                }

                                return next
                              })
                              validateAndFixTransferType(idx)
                            }}
                          >
                            {providers.map((p) => (
                              <SelectItem key={p.storage_type}>
                                {p.storage_type}
                              </SelectItem>
                            ))}
                          </Select>
                          <Input
                            label="源路径"
                            value={lib.src_path}
                            onValueChange={(v) =>
                              setLibraries((prev) => {
                                const next = [...prev]

                                next[idx] = { ...next[idx], src_path: v }

                                return next
                              })
                            }
                          />

                          <Select
                            isDisabled={
                              loadingProviders || providers.length === 0
                            }
                            label="目标存储类型"
                            selectedKeys={lib.dst_type ? [lib.dst_type] : []}
                            onSelectionChange={(keys) => {
                              const val = Array.from(keys)[0] as string

                              setLibraries((prev) => {
                                const next = [...prev]

                                next[idx] = {
                                  ...next[idx],
                                  dst_type: val as any,
                                }

                                return next
                              })
                              validateAndFixTransferType(idx)
                            }}
                          >
                            {providers.map((p) => (
                              <SelectItem key={p.storage_type}>
                                {p.storage_type}
                              </SelectItem>
                            ))}
                          </Select>
                          <Input
                            label="目标路径"
                            value={lib.dst_path}
                            onValueChange={(v) =>
                              setLibraries((prev) => {
                                const next = [...prev]

                                next[idx] = { ...next[idx], dst_path: v }

                                return next
                              })
                            }
                          />

                          <Select
                            label="传输类型"
                            selectedKeys={[lib.transfer_type]}
                            onSelectionChange={(keys) => {
                              const val = Array.from(keys)[0] as TransferType

                              setLibraries((prev) => {
                                const next = [...prev]

                                next[idx] = { ...next[idx], transfer_type: val }

                                return next
                              })
                            }}
                          >
                            {getAvailableTransferTypes(
                              lib.src_type,
                              lib.dst_type,
                            ).map((opt) => (
                              <SelectItem key={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </Select>

                          <div className="grid grid-cols-2 gap-2">
                            <Checkbox
                              isSelected={lib.organize_by_type}
                              size="md"
                              onValueChange={(val) =>
                                setLibraries((prev) => {
                                  const next = [...prev]

                                  next[idx] = {
                                    ...next[idx],
                                    organize_by_type: val,
                                  }

                                  return next
                                })
                              }
                            >
                              按类型分文件夹
                            </Checkbox>
                            <Checkbox
                              isSelected={lib.organize_by_category}
                              size="md"
                              onValueChange={(val) =>
                                setLibraries((prev) => {
                                  const next = [...prev]

                                  next[idx] = {
                                    ...next[idx],
                                    organize_by_category: val,
                                  }

                                  return next
                                })
                              }
                            >
                              按分类分文件夹
                            </Checkbox>
                            <Checkbox
                              isSelected={lib.scrape}
                              size="md"
                              onValueChange={(val) =>
                                setLibraries((prev) => {
                                  const next = [...prev]

                                  next[idx] = {
                                    ...next[idx],
                                    scrape: val,
                                  }

                                  return next
                                })
                              }
                            >
                              开启刮削
                            </Checkbox>
                            <Checkbox
                              isSelected={lib.notify}
                              size="md"
                              onValueChange={(val) =>
                                setLibraries((prev) => {
                                  const next = [...prev]

                                  next[idx] = {
                                    ...next[idx],
                                    notify: val,
                                  }

                                  return next
                                })
                              }
                            >
                              入库通知
                            </Checkbox>
                          </div>
                        </CardBody>
                      </Card>
                    </SortableLibraryItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
          <div className="flex justify-end">
            <Button
              color="primary"
              isLoading={loading}
              onPress={updateLibrariesData}
            >
              {loading ? '保存中...' : '保存媒体库配置'}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

function SortableLibraryItem({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </div>
  )
}
