import type { StorageFileInfo } from '@/types/storage'
import type { MediaType } from '@/types'

import { useMemo, useRef, useState } from 'react'
import { Button } from '@heroui/button'
import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import { Listbox, ListboxItem } from '@heroui/listbox'
import { Select, SelectItem } from '@heroui/select'
import { Switch } from '@heroui/switch'
import { Plus } from 'lucide-react'

import {
  MEDIA_TYPE_OPTIONS,
  MAX_EPISODE_NUMBER,
  MAX_SEASON_NUMBER,
} from './constants'

import { TRANSFER_TYPE_OPTIONS } from '@/ui/settings/constants'
import { useAppStore } from '@/stores/useAppStore'
import { ButtonIcon } from '@/components/icon'
import { useManualSort } from '@/hooks/settings/useManualSort'

type ManualSortingFormProps = {
  file: StorageFileInfo
  onSubmitSuccess: () => void
}

export const ManualSortingForm = (props: ManualSortingFormProps) => {
  const { file, onSubmitSuccess } = props

  const { providers, mediaLibraries } = useAppStore()
  const [destinationValue, setDestinationValue] = useState(
    mediaLibraries[0]?.dst_path ?? '',
  )
  const [isComboOpen, setIsComboOpen] = useState(false)
  const [mediaType, setMediaType] = useState(MEDIA_TYPE_OPTIONS[0].value)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const filteredOptions = useMemo(() => {
    return mediaLibraries.map((item) => item.dst_path)
  }, [mediaLibraries])

  const { handleSubmit, isLoading } = useManualSort({
    file,
    destinationValue,
    onSubmitSuccess,
  })

  return (
    <Form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
      <Select
        defaultSelectedKeys={[providers[0].storage_type]}
        label="目的存储"
        name="dst_storage_type"
        size="sm"
      >
        {providers.map((item) => (
          <SelectItem key={item.storage_type}>{item.storage_type}</SelectItem>
        ))}
      </Select>
      <Select
        defaultSelectedKeys={[TRANSFER_TYPE_OPTIONS[0].value]}
        label="整理方式"
        name="transfer_type"
        size="sm"
      >
        {TRANSFER_TYPE_OPTIONS.map((option) => (
          <SelectItem key={option.value} textValue={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
      <div ref={containerRef} className="col-span-2 relative">
        <Input
          ref={inputRef}
          className="relative z-1"
          description="整理的目的地路径，留空将自动匹配"
          label="目的地路径"
          name="dst_path"
          size="sm"
          value={destinationValue}
          onBlur={() => {
            requestAnimationFrame(() => {
              if (!containerRef.current?.contains(document.activeElement)) {
                setIsComboOpen(false)
              }
            })
          }}
          onFocus={() => setIsComboOpen(true)}
          onValueChange={(val) => {
            setDestinationValue(val)
            setIsComboOpen(true)
          }}
        />
        {isComboOpen && filteredOptions.length > 0 && (
          <div
            className="absolute left-0 right-0 mt-1 z-51 shadow-medium bg-content1 rounded-medium"
            tabIndex={-1}
            onMouseDown={(e) => {
              e.preventDefault()
              inputRef.current?.focus({ preventScroll: true })
            }}
          >
            <Listbox
              aria-describedby="选择目的地路径"
              aria-label="选择目的地路径"
              selectionMode="single"
              onAction={(key) => {
                const chosen = String(key)

                setDestinationValue(chosen)
                setIsComboOpen(false)
                requestAnimationFrame(() => {
                  inputRef.current?.focus({ preventScroll: true })
                })
              }}
            >
              {filteredOptions.map((opt) => (
                <ListboxItem key={opt}>{opt}</ListboxItem>
              ))}
            </Listbox>
          </div>
        )}
      </div>
      <Select
        defaultSelectedKeys={[MEDIA_TYPE_OPTIONS[0].value]}
        description="文件的媒体类型"
        label="类型"
        name="media_type"
        size="sm"
        onSelectionChange={(keys) => {
          setMediaType(Array.from(keys)[0] as MediaType)
        }}
      >
        {MEDIA_TYPE_OPTIONS.map((option) => (
          <SelectItem key={option.value} textValue={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
      <Input
        description="按名称查询媒体编号，留空自动识别"
        label="TheMovieDb编号"
        name="tmdb_id"
        size="sm"
      />

      {mediaType === 'TV' && (
        <>
          <Input
            className="col-span-1"
            description="指定剧集组"
            label="剧集组编号"
            name="season_number"
            size="sm"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select description="第几季" label="季" name="season">
              {Array.from({ length: MAX_SEASON_NUMBER }, (_, i) => (
                <SelectItem key={i + 1} textValue={i + 1 + ''}>
                  {i + 1}
                </SelectItem>
              ))}
            </Select>
            <Select description="第几集" label="集" name="episode_str">
              {Array.from({ length: MAX_EPISODE_NUMBER }, (_, i) => (
                <SelectItem key={i + 1} textValue={i + 1 + ''}>
                  {i + 1}
                </SelectItem>
              ))}
            </Select>
          </div>
          <Input
            description="使用定位文件名中的集数部分以辅助识别"
            label="集数定位"
            name="episode_format"
            size="sm"
          />
          <Input
            description="集数偏移运算，如-10或EP*2"
            label="集数偏移"
            name="episode_offset"
            size="sm"
          />
        </>
      )}

      <Input
        description="指定Part，如part1"
        label="指定Part"
        name="part"
        size="sm"
      />
      {/* <Input
        description="只整理大于最小文件大小的文件"
        label="最小文件大小"
        name="min_file_size"
        size="sm"
      /> */}
      <div className="col-span-2 flex flex-wrap gap-3 sm:gap-10">
        <Switch name="scrape" size="sm" value="true">
          <div className="flex flex-col gap-1">
            <p className="text-foreground-500">刮削元数据</p>
            <p className="text-foreground-500 text-tiny">
              整理完成后自动刮削元数据
            </p>
          </div>
        </Switch>
        <Switch
          className="sm:flex-none"
          name="organize_by_type"
          size="sm"
          value="true"
        >
          <div className="flex flex-col gap-1">
            <p className="text-foreground-500">是否按类型整理</p>
            <p className="text-foreground-500 text-tiny">只整理同一类型文件</p>
          </div>
        </Switch>
        <Switch
          className="sm:flex-none"
          name="organize_by_category"
          size="sm"
          value="true"
        >
          <div className="flex flex-col gap-1">
            <p className="text-foreground-500">是否按分类整理</p>
            <p className="text-foreground-500 text-tiny">只整理同一分类文件</p>
          </div>
        </Switch>
      </div>
      <div className="col-span-2 flex justify-end gap-4">
        <Button
          color="success"
          isLoading={isLoading}
          startContent={<ButtonIcon icon={Plus} />}
          type="submit"
          variant="shadow"
        >
          加入整理队列
        </Button>
      </div>
    </Form>
  )
}
