import type { TransferType } from '@/types/storage'
import type { LibraryConfig } from '@/types/config'

import { Card, CardBody } from '@heroui/card'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Button } from '@heroui/button'
import { Checkbox } from '@heroui/checkbox'
import { GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react'

import { TRANSFER_TYPE_OPTIONS } from '../constants'

import { cn } from '@/utils/twUtils'
import { useAppStore } from '@/stores/useAppStore'

interface LibraryItemProps {
  lib: LibraryConfig & { id: string }
  idx: number
  onUpdate: (idx: number, updates: Partial<LibraryConfig>) => void
  onRemove: (idx: number) => void
  getAvailableTransferTypes: (
    srcType: string,
    dstType: string,
  ) => Array<(typeof TRANSFER_TYPE_OPTIONS)[number]>
  validateAndFixTransferType: (idx: number) => void
  isDraggingOver?: boolean
}

export function LibraryItem({
  lib,
  idx,
  onUpdate,
  onRemove,
  getAvailableTransferTypes,
  validateAndFixTransferType,
  isDraggingOver = false,
}: LibraryItemProps) {
  const { providers } = useAppStore()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lib.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const updateField = (field: keyof LibraryConfig, value: any) => {
    onUpdate(idx, { [field]: value })
  }

  const [nameValue, setNameValue] = useState(lib.name)
  const [srcPathValue, setSrcPathValue] = useState(lib.src_path)
  const [dstPathValue, setDstPathValue] = useState(lib.dst_path)
  const [isComposing, setIsComposing] = useState(false)

  useEffect(() => {
    setNameValue(lib.name)
  }, [lib.name])
  useEffect(() => {
    setSrcPathValue(lib.src_path)
  }, [lib.src_path])
  useEffect(() => {
    setDstPathValue(lib.dst_path)
  }, [lib.dst_path])

  const handleChange =
    (field: 'name' | 'src_path' | 'dst_path') => (value: string) => {
      if (field === 'name') setNameValue(value)
      if (field === 'src_path') setSrcPathValue(value)
      if (field === 'dst_path') setDstPathValue(value)
      if (!isComposing) {
        updateField(field, value)
      }
    }

  const handleCompositionStart = () => setIsComposing(true)
  const handleCompositionEnd =
    (field: 'name' | 'src_path' | 'dst_path') => (value: string) => {
      setIsComposing(false)
      updateField(field, value)
    }

  const mergedHandleAttributes = { ...(attributes as any), tabIndex: -1 }

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={cn(
          'transition-all duration-300',
          isDragging && 'scale-105',
          isDraggingOver && !isDragging && 'opacity-40',
        )}
        radius="lg"
        shadow="sm"
      >
        <CardBody className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GripVertical
                className="w-4 h-4 text-foreground-500 cursor-grab active:cursor-grabbing focus:outline-none"
                {...mergedHandleAttributes}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') e.preventDefault()
                }}
                {...listeners}
              />
              <span className="text-sm font-medium">
                {lib.name || '未命名媒体库'}
              </span>
            </div>
            <Button
              color="danger"
              size="sm"
              variant="light"
              onPress={() => onRemove(idx)}
            >
              删除
            </Button>
          </div>

          <Input
            defaultValue={nameValue}
            label="名称"
            onCompositionEnd={(e) =>
              handleCompositionEnd('name')(e.currentTarget.value)
            }
            onCompositionStart={handleCompositionStart}
            onValueChange={handleChange('name')}
          />

          <Select
            isDisabled={providers.length === 0}
            label="源存储类型"
            selectedKeys={lib.src_type ? [lib.src_type] : []}
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0] as string

              updateField('src_type', val)
              validateAndFixTransferType(idx)
            }}
          >
            {providers.map((p) => (
              <SelectItem key={p.storage_type}>{p.storage_type}</SelectItem>
            ))}
          </Select>

          <Input
            defaultValue={srcPathValue}
            label="源路径"
            onCompositionEnd={(e) =>
              handleCompositionEnd('src_path')(e.currentTarget.value)
            }
            onCompositionStart={handleCompositionStart}
            onValueChange={handleChange('src_path')}
          />

          <Select
            isDisabled={providers.length === 0}
            label="目标存储类型"
            selectedKeys={lib.dst_type ? [lib.dst_type] : []}
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0] as string

              updateField('dst_type', val)
              validateAndFixTransferType(idx)
            }}
          >
            {providers.map((p) => (
              <SelectItem key={p.storage_type}>{p.storage_type}</SelectItem>
            ))}
          </Select>

          <Input
            defaultValue={dstPathValue}
            label="目标路径"
            onCompositionEnd={(e) =>
              handleCompositionEnd('dst_path')(e.currentTarget.value)
            }
            onCompositionStart={handleCompositionStart}
            onValueChange={handleChange('dst_path')}
          />

          <Select
            label="传输类型"
            selectedKeys={[lib.transfer_type]}
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0] as TransferType

              updateField('transfer_type', val)
            }}
          >
            {getAvailableTransferTypes(lib.src_type, lib.dst_type).map(
              (opt) => (
                <SelectItem key={opt.value}>{opt.label}</SelectItem>
              ),
            )}
          </Select>

          <div className="grid grid-cols-2 gap-2">
            <Checkbox
              isSelected={lib.organize_by_type}
              size="md"
              onValueChange={(val) => updateField('organize_by_type', val)}
            >
              按类型分文件夹
            </Checkbox>
            <Checkbox
              isSelected={lib.organize_by_category}
              size="md"
              onValueChange={(val) => updateField('organize_by_category', val)}
            >
              按分类分文件夹
            </Checkbox>
            <Checkbox
              isSelected={lib.scrape}
              size="md"
              onValueChange={(val) => updateField('scrape', val)}
            >
              开启刮削
            </Checkbox>
            <Checkbox
              isSelected={lib.notify}
              size="md"
              onValueChange={(val) => updateField('notify', val)}
            >
              入库通知
            </Checkbox>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
