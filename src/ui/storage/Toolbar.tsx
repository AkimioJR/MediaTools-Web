import type { StorageProviderInterface } from '@/types/storage'

import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/dropdown'
import { Switch } from '@heroui/switch'
import {
  Database,
  FolderPlus,
  Upload,
  ArrowDownAZ,
  ClockArrowDown,
  ArrowUpAZ,
  ClockArrowUp,
  type LucideIcon,
} from 'lucide-react'

import { ButtonIcon, HeaderIcon } from '@/components/icon'

export type SortMode =
  | 'name_asc'
  | 'name_desc'
  | 'mod_time_asc'
  | 'mod_time_desc'

export interface SortOptionType {
  label: string
  value: SortMode
  icon: LucideIcon
}

const SORT_OPTIONS: SortOptionType[] = [
  { label: '按名称升序', value: 'name_asc', icon: ArrowDownAZ },
  { label: '按名称降序', value: 'name_desc', icon: ArrowUpAZ },
  { label: '按修改时间升序', value: 'mod_time_asc', icon: ClockArrowDown },
  { label: '按修改时间降序', value: 'mod_time_desc', icon: ClockArrowUp },
]

export function Toolbar({
  providers,
  storageType,
  breadcrumbs,
  showPathInput,
  pathInputValue,
  loadingUpload,
  showHiddenFiles,
  sortMode,
  onProviderChange,
  onBreadcrumbClick,
  onTogglePathInput,
  onPathInputChange,
  onCreateFolder,
  onUpload,
  onToggleSort,
  onToggleHidden,
}: {
  providers: StorageProviderInterface[]
  storageType: string
  breadcrumbs: { title: string; path: string }[]
  showPathInput: boolean
  pathInputValue: string
  loadingUpload: boolean
  showHiddenFiles: boolean
  sortMode: SortMode
  onProviderChange: (key: string) => void
  onBreadcrumbClick: (path: string) => void
  onTogglePathInput: () => void
  onPathInputChange: (v: string) => void
  onCreateFolder: () => void
  onUpload: () => void
  onToggleSort: (sortOption: SortOptionType) => void
  onToggleHidden: (v: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col items-center sm:flex-row gap-3 sm:gap-4 flex-1">
        <Select
          aria-label="存储器选择"
          className="w-full sm:w-48"
          placeholder="请选择存储器"
          selectedKeys={storageType ? [storageType] : []}
          size="md"
          startContent={<Database className="w-4 h-4" />}
          onSelectionChange={(keys) =>
            onProviderChange(Array.from(keys)[0] as string)
          }
        >
          {providers.map((provider) => (
            <SelectItem key={provider.storage_type}>
              {provider.storage_type}
            </SelectItem>
          ))}
        </Select>

        <div className="flex items-center gap-2 p-2 bg-content2 rounded-lg flex-1 min-w-0 w-full">
          <span className="text-xs sm:text-sm text-foreground-500 whitespace-nowrap flex-shrink-0">
            当前路径:
          </span>
          {showPathInput ? (
            <Input
              className="text-xs"
              placeholder="请输入路径"
              size="sm"
              value={pathInputValue}
              onKeyDown={(e) => {
                if ((e as any).key === 'Enter') {
                  onTogglePathInput()
                }
              }}
              onValueChange={onPathInputChange}
            />
          ) : (
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide min-w-0 flex-1">
              {breadcrumbs.map((breadcrumb, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 flex-shrink-0"
                >
                  {index > 0 && (
                    <span className="text-foreground-400 flex-shrink-0">/</span>
                  )}
                  <Button
                    className="h-6 px-1 min-w-0 text-xs whitespace-nowrap flex-shrink-0"
                    size="sm"
                    variant="light"
                    onPress={() => onBreadcrumbClick(breadcrumb.path)}
                  >
                    {breadcrumb.title}
                  </Button>
                </div>
              ))}
            </div>
          )}
          <Button
            className="h-6 min-w-0 text-xs whitespace-nowrap"
            size="sm"
            variant="light"
            onPress={onTogglePathInput}
          >
            {showPathInput ? '跳转' : '跳转至指定路径'}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            color="primary"
            isDisabled={!storageType}
            size="sm"
            startContent={<ButtonIcon icon={FolderPlus} />}
            variant="shadow"
            onPress={onCreateFolder}
          >
            新建文件夹
          </Button>
          <Button
            color="success"
            isDisabled={!storageType || loadingUpload}
            size="sm"
            startContent={<ButtonIcon icon={Upload} />}
            variant="shadow"
            onPress={onUpload}
          >
            {loadingUpload ? '上传中...' : '上传文件'}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                aria-label="切换排序"
                size="sm"
                variant="light"
              >
                <HeaderIcon
                  icon={
                    SORT_OPTIONS.find((mode) => mode.value === sortMode)
                      ?.icon || ArrowDownAZ
                  }
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              {SORT_OPTIONS.map((mode) => (
                <DropdownItem
                  key={mode.value}
                  onPress={() => {
                    onToggleSort(mode)
                  }}
                >
                  {mode.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <span className="text-xs sm:text-sm text-foreground-500">
            显示隐藏文件
          </span>
          <Switch
            aria-label="显示隐藏文件"
            isSelected={showHiddenFiles}
            size="sm"
            onValueChange={onToggleHidden}
          />
        </div>
      </div>
    </div>
  )
}
