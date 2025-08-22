import type { TransferType } from '@/types/storage'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'

import { Button } from '@heroui/button'
import { Plus, FolderPen, DatabaseZap } from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable'

import { BaseSettingsCard, LoadingSpinner } from './BaseSettingsCard'
import { TRANSFER_TYPE_OPTIONS, SETTINGS_STYLES } from './constants'
import { LibraryItem, CustomWordConfig, FormatConfig } from './components'

import { useMediaConfig, useSettingsLoader } from '@/hooks/settings'
import { LibraryConfig } from '@/types/config'
import { ButtonIcon } from '@/components/icon'
import { useAppStore } from '@/stores/useAppStore'

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
  const { providers } = useAppStore()
  const [activeId, setActiveId] = useState<string | null>(null)

  useSettingsLoader({ loadData: loadFormatData })
  useSettingsLoader({ loadData: loadCustomWordData })
  useSettingsLoader({ loadData: loadLibrariesData })

  const generateId = () =>
    `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

  useEffect(() => {
    setSortableLibraries((prev) =>
      libraries.map((lib, i) => {
        const existing = prev[i]
        const id = existing?.id || generateId()

        return { ...lib, id }
      }),
    )
  }, [libraries])

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, // 鼠标移动5px后才激活拖拽
        delay: 100, // 延迟100ms激活
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // 触摸延迟100ms激活
        tolerance: 5, // 触摸容差5px
      },
    }),
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)

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

  const getAvailableTransferTypes = (srcType: string, dstType: string) => {
    if (srcType !== dstType) {
      return TRANSFER_TYPE_OPTIONS.filter(
        (t) => t.value === 'Copy' || t.value === 'Move',
      )
    }

    const provider = providers.find((p) => p.storage_type === srcType)
    const supported = provider?.transfer_type || ['Copy', 'Move']

    return TRANSFER_TYPE_OPTIONS.filter((t) => supported.includes(t.value))
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

  const updateLibrary = (idx: number, updates: Partial<LibraryConfig>) => {
    setLibraries((prev) => {
      const next = [...prev]

      next[idx] = { ...next[idx], ...updates }

      return next
    })
  }

  const parseLines = (value: string) =>
    value.split(/\r?\n/).map((w) => w.trim())

  const ensureFormat = (prev: any) =>
    prev ? { ...prev } : { movie: '', tv: '' }

  const ensureCustomWord = (prev: any) =>
    prev
      ? { ...prev }
      : { identify_word: [], customization: [], exclude_words: [] }

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
    return <LoadingSpinner />
  }

  return (
    <div className={SETTINGS_STYLES.container}>
      {/* 媒体库重命名格式 */}
      <BaseSettingsCard
        icon={FolderPen}
        loading={loading}
        title="媒体库重命名格式"
        onSave={updateFormatData}
      >
        <FormatConfig
          formatConfig={formatConfig}
          onUpdateMovie={(value) =>
            setFormatConfig((prev) => ({
              ...ensureFormat(prev),
              movie: value,
            }))
          }
          onUpdateTV={(value) =>
            setFormatConfig((prev) => ({
              ...ensureFormat(prev),
              tv: value,
            }))
          }
        />
      </BaseSettingsCard>

      {/* 自定义词条配置 */}
      <BaseSettingsCard
        icon={DatabaseZap}
        loading={loading}
        title="自定义词条配置"
        onSave={updateCustomWordData}
      >
        <CustomWordConfig
          customWordConfig={customWordConfig}
          onUpdateField={updateCustomWordField}
        />
      </BaseSettingsCard>

      {/* 媒体库配置 */}
      <BaseSettingsCard
        icon={DatabaseZap}
        loading={loading}
        title="媒体库配置"
        onSave={updateLibrariesData}
      >
        <div className="flex flex-wrap gap-3">
          <Button
            color="primary"
            size="sm"
            startContent={<ButtonIcon icon={Plus} />}
            variant="shadow"
            onPress={addLibrary}
          >
            添加媒体库
          </Button>
        </div>

        {sortableLibraries.length === 0 ? (
          <div className={SETTINGS_STYLES.emptyState}>暂无媒体库配置</div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToFirstScrollableAncestor]}
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <SortableContext
              items={sortableLibraries.map((lib) => lib.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {sortableLibraries.map((lib, idx) => (
                  <LibraryItem
                    key={lib.id}
                    getAvailableTransferTypes={getAvailableTransferTypes}
                    idx={idx}
                    isDraggingOver={activeId !== null && activeId !== lib.id}
                    lib={lib}
                    loadingProviders={false}
                    providers={providers}
                    validateAndFixTransferType={validateAndFixTransferType}
                    onRemove={removeLibrary}
                    onUpdate={updateLibrary}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </BaseSettingsCard>
    </div>
  )
}
