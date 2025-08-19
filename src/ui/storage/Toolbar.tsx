import type { StorageProviderInterface } from '@/types/storage'

import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Switch } from '@heroui/switch'
import {
  Database,
  FolderPlus,
  Upload,
  ArrowDownAZ,
  ClockArrowDown,
} from 'lucide-react'

import { HeaderIcon } from '@/components/icon'

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
  sortMode: 'name' | 'mod_time'
  onProviderChange: (key: string) => void
  onBreadcrumbClick: (path: string) => void
  onTogglePathInput: () => void
  onPathInputChange: (v: string) => void
  onCreateFolder: () => void
  onUpload: () => void
  onToggleSort: () => void
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
            startContent={<FolderPlus className="w-4 h-4" />}
            variant="solid"
            onPress={onCreateFolder}
          >
            新建文件夹
          </Button>
          <Button
            color="success"
            isDisabled={!storageType || loadingUpload}
            size="sm"
            startContent={<Upload className="w-4 h-4" />}
            variant="solid"
            onPress={onUpload}
          >
            {loadingUpload ? '上传中...' : '上传文件'}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            aria-label="切换排序"
            size="sm"
            variant="light"
            onPress={onToggleSort}
          >
            <HeaderIcon
              icon={sortMode === 'name' ? ArrowDownAZ : ClockArrowDown}
            />
          </Button>
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
