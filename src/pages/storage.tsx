import type { StorageFileInfo, StorageProviderInterface } from '@/types/storage'

import { Card, CardBody } from '@heroui/card'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from '@heroui/table'
import { Button } from '@heroui/button'
import { Spinner } from '@heroui/spinner'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Switch } from '@heroui/switch'
import { Pagination } from '@heroui/pagination'
import {
  File,
  Folder,
  Upload,
  Download,
  Trash2,
  Database,
  Copy,
  Move,
  FolderPlus,
  ScanSearch,
} from 'lucide-react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAsyncList } from '@react-stately/data'

import { StorageService } from '@/services/storage'
import { showSuccess, handleApiError } from '@/utils/message'
import { useModal } from '@/components/modal-provider'
import { MediaRecognitionDialog } from '@/components/media-recognition-dialog'

interface FileColumn {
  key: string
  label: string
  className?: string
  width?: number
}

interface LoadingStates {
  providers: boolean
  files: boolean
  upload: boolean
  delete: boolean
  copy: boolean
  move: boolean
}

const ROWS_PER_PAGE = 20
const STORAGE_KEYS = {
  SORT_DESCRIPTOR: 'storage-table-sort',
  SHOW_HIDDEN_FILES: 'storage-show-hidden-files',
} as const

const TABLE_COLUMNS: FileColumn[] = [
  { key: 'name', label: '名称' },
  { key: 'size', label: '大小', className: 'hidden sm:table-cell' },
  { key: 'mod_time', label: '修改时间', className: 'hidden sm:table-cell' },
  { key: 'actions', label: '操作', className: 'sm:w-[200px]', width: 120 },
]

const getSavedSortDescriptor = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SORT_DESCRIPTOR)

    return saved
      ? JSON.parse(saved)
      : { column: 'name', direction: 'ascending' }
  } catch {
    return { column: 'name', direction: 'ascending' }
  }
}

const getShowHiddenFilesSetting = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SHOW_HIDDEN_FILES)

    return saved === 'true'
  } catch {
    return false
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const isWinRootPath = (path: string) => path.endsWith(':')

export default function StoragePage() {
  const [currentPath, setCurrentPath] = useState('')
  const [storageType, setStorageType] = useState('')
  const [providers, setProviders] = useState<StorageProviderInterface[]>([])

  const [showPathInput, setShowPathInput] = useState(false)
  const [pathInputValue, setPathInputValue] = useState('')
  const [page, setPage] = useState(1)
  const [showHiddenFiles, setShowHiddenFiles] = useState(
    getShowHiddenFilesSetting,
  )

  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    providers: false,
    files: false,
    upload: false,
    delete: false,
    copy: false,
    move: false,
  })

  const { openModal } = useModal()

  const handleAsyncOperation = useCallback(
    async (
      operation: () => Promise<void>,
      loadingKey: keyof LoadingStates,
      successMessage?: string,
    ) => {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }))
      try {
        await operation()
        if (successMessage) showSuccess(successMessage)
      } catch (error) {
        handleApiError(error, '操作失败')
      } finally {
        setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }))
      }
    },
    [],
  )

  useEffect(() => {
    const loadProviders = async () => {
      await handleAsyncOperation(async () => {
        const providerList =
          await StorageService.ProviderService.getProviderList()

        setProviders(providerList)
        if (providerList.length > 0) {
          setStorageType(providerList[0].storage_type)
        }
      }, 'providers')
    }

    loadProviders()
  }, [handleAsyncOperation])

  useEffect(() => {
    if (storageType) {
      fileList.reload()
    }
  }, [currentPath, storageType])

  const fileList = useAsyncList<StorageFileInfo>({
    async load({}) {
      if (!storageType) {
        return { items: [] }
      }

      try {
        const files = await StorageService.List(storageType, currentPath, true)

        const processedFiles = files.map((file) => ({
          ...file,
          size: file.size || 0,
        }))

        return { items: processedFiles }
      } catch (error) {
        handleApiError(error, '加载文件列表失败')

        return { items: [] }
      }
    },
    async sort({ items, sortDescriptor }) {
      if (sortDescriptor) {
        localStorage.setItem(
          STORAGE_KEYS.SORT_DESCRIPTOR,
          JSON.stringify(sortDescriptor),
        )
      }

      if (!items || items.length === 0) {
        return { items }
      }

      const sortedItems = [...items].sort((a, b) => {
        if (!sortDescriptor) return 0

        const column = sortDescriptor.column
        const isAscending = sortDescriptor.direction === 'ascending'

        const isADirectory = a.type === 'Directory'
        const isBDirectory = b.type === 'Directory'

        // if (column !== 'name' && isADirectory !== isBDirectory) {
        //   return isADirectory ? -1 : 1
        // }

        let result = 0

        switch (column) {
          case 'name':
            result = (a.name || '').localeCompare(b.name || '')
            break

          case 'mod_time': {
            // 日期排序：转换为时间戳进行比较
            const aTime = a.mod_time ? new Date(a.mod_time).getTime() : 0
            const bTime = b.mod_time ? new Date(b.mod_time).getTime() : 0

            result = aTime - bTime
            break
          }

          case 'size': {
            const aSize = isADirectory ? 0 : Number(a.size || 0)
            const bSize = isBDirectory ? 0 : Number(b.size || 0)

            result = aSize - bSize
            break
          }

          default:
            result = 0
        }

        return isAscending ? result : -result
      })

      return { items: sortedItems }
    },
    getKey: (item) => item.path,
    initialSortDescriptor: getSavedSortDescriptor(),
  })

  const breadcrumbs = useMemo(() => {
    const parts = currentPath.split('/').filter(Boolean)
    const breadcrumbs = [{ title: '根目录', path: '' }]
    let fullPath = ''

    parts.forEach((part, index) => {
      if (index === 0 && isWinRootPath(part)) {
        fullPath += `${part}`
      } else {
        fullPath += `/${part}`
      }
      breadcrumbs.push({ title: part, path: fullPath })
    })

    return breadcrumbs
  }, [currentPath])

  const reloadFiles = useCallback(async () => {
    await fileList.reload()
  }, [fileList])

  const handleFileClick = useCallback((file: StorageFileInfo) => {
    if (file.type === 'Directory') {
      setCurrentPath(file.path)
    }
  }, [])

  const handleTogglePathInput = useCallback(() => {
    if (showPathInput) {
      if (pathInputValue.trim()) {
        setCurrentPath(pathInputValue.trim())
      }
      setShowPathInput(false)
    } else {
      setPathInputValue(currentPath)
      setShowPathInput(true)
    }
  }, [showPathInput, pathInputValue, currentPath])

  const handleCreateFolder = useCallback(async () => {
    const name = prompt('请输入文件夹名称:')

    if (!name || !storageType) return

    await handleAsyncOperation(
      async () => {
        const folderPath = currentPath.endsWith('/')
          ? currentPath + name
          : currentPath + '/' + name

        await StorageService.Mkdir(storageType, folderPath)
        await reloadFiles()
      },
      'files',
      '文件夹创建成功',
    )
  }, [storageType, currentPath, handleAsyncOperation, reloadFiles])

  const handleUpload = useCallback(() => {
    const input = document.createElement('input')

    input.type = 'file'
    input.multiple = true

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files

      if (!files || !storageType) return

      await handleAsyncOperation(
        async () => {
          for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const targetPath = currentPath.endsWith('/')
              ? currentPath + file.name
              : currentPath + '/' + file.name

            await StorageService.Upload(storageType, targetPath, file)
          }
          await reloadFiles()
        },
        'upload',
        `成功上传 ${files.length} 个文件`,
      )
    }

    input.click()
  }, [storageType, currentPath, handleAsyncOperation, reloadFiles])

  const handleRecognizeSelectedMedia = useCallback(
    async (file: StorageFileInfo) => {
      await openModal(
        () => <MediaRecognitionDialog defaultValue={file.name} />,
        {
          title: '媒体识别',
          size: window.innerWidth < 768 ? '3xl' : '4xl',
        },
      )
    },
    [openModal],
  )

  const handleDownload = useCallback(
    async (file: StorageFileInfo) => {
      await handleAsyncOperation(
        async () => {
          await StorageService.DownloadFile(storageType, file.path, file.name)
        },
        'files',
        '文件下载开始',
      )
    },
    [storageType, handleAsyncOperation],
  )

  const handleDelete = useCallback(
    async (file: StorageFileInfo) => {
      if (!confirm(`确定要删除 "${file.name}" 吗？`)) return

      await handleAsyncOperation(
        async () => {
          await StorageService.Delete(storageType, file.path)
          await reloadFiles()
        },
        'delete',
        '文件删除成功',
      )
    },
    [storageType, handleAsyncOperation, reloadFiles],
  )

  function CopyMoveForm({
    providers,
    defaultProvider,
    defaultPath,
    onSubmit,
    onCancel,
  }: {
    providers: StorageProviderInterface[]
    defaultProvider: string
    defaultPath: string
    onSubmit: (provider: string, path: string) => void
    onCancel: () => void
  }) {
    const [provider, setProvider] = useState(defaultProvider)
    const [path, setPath] = useState(defaultPath)

    return (
      <div className="space-y-4">
        <Select
          aria-label="目标存储器"
          label="目标存储器"
          selectedKeys={provider ? [provider] : []}
          variant="bordered"
          onSelectionChange={(keys) =>
            setProvider(Array.from(keys)[0] as string)
          }
        >
          {providers.map((p) => (
            <SelectItem key={p.storage_type}>{p.storage_type}</SelectItem>
          ))}
        </Select>
        <Input
          label="目标路径"
          placeholder="请输入目标路径"
          value={path}
          variant="bordered"
          onValueChange={setPath}
        />
        <div className="flex justify-end gap-2">
          <Button variant="light" onPress={onCancel}>
            取消
          </Button>
          <Button color="primary" onPress={() => onSubmit(provider, path)}>
            确认
          </Button>
        </div>
      </div>
    )
  }

  const openCopyModal = async (file: StorageFileInfo) => {
    const result = await openModal<
      { provider: string; path: string } | undefined
    >(
      (modal) => (
        <CopyMoveForm
          defaultPath={currentPath}
          defaultProvider={storageType}
          providers={providers}
          onCancel={() => modal.close(undefined)}
          onSubmit={(provider, path) => modal.close({ provider, path })}
        />
      ),
      { title: '复制到' },
    )

    if (!result) return

    await handleAsyncOperation(
      async () => {
        await StorageService.Copy(
          storageType,
          file.path,
          result.provider,
          result.path,
        )
        await reloadFiles()
      },
      'copy',
      '文件复制成功',
    )
  }

  const openMoveModal = async (file: StorageFileInfo) => {
    const result = await openModal<
      { provider: string; path: string } | undefined
    >(
      (modal) => (
        <CopyMoveForm
          defaultPath={currentPath}
          defaultProvider={storageType}
          providers={providers}
          onCancel={() => modal.close(undefined)}
          onSubmit={(provider, path) => modal.close({ provider, path })}
        />
      ),
      { title: '移动到' },
    )

    if (!result) return

    await handleAsyncOperation(
      async () => {
        await StorageService.Move(
          storageType,
          file.path,
          result.provider,
          result.path,
        )
        await reloadFiles()
      },
      'move',
      '文件移动成功',
    )
  }

  const getFileIcon = useCallback((file: StorageFileInfo) => {
    if (file.type === 'Directory') {
      return <Folder className="w-5 h-5 text-amber-500" />
    }

    return <File className="w-5 h-5 text-gray-500" />
  }, [])

  // 过滤和分页逻辑优化
  const filteredItems = useMemo(() => {
    return showHiddenFiles
      ? fileList.items
      : fileList.items.filter((file) => !file.name.startsWith('.'))
  }, [showHiddenFiles, fileList.items])

  const pages = Math.ceil(filteredItems.length / ROWS_PER_PAGE)

  // 当过滤条件改变导致总页数减少，且当前页码超出总页数时，自动调整页码
  useEffect(() => {
    if (page > pages && pages > 0) {
      setPage(pages)
    }
  }, [pages, page])

  const items = useMemo(() => {
    return filteredItems.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)
  }, [filteredItems, page])

  // 保存隐藏文件设置
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.SHOW_HIDDEN_FILES,
      showHiddenFiles.toString(),
    )
  }, [showHiddenFiles])

  return (
    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
      {/* 操作工具栏 */}
      <Card radius="lg" shadow="sm">
        <CardBody className="p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* 存储器选择和路径导航 */}
            <div className="flex flex-col items-center sm:flex-row gap-3 sm:gap-4 flex-1">
              <Select
                aria-label="存储器选择"
                className="w-full sm:w-48"
                placeholder="请选择存储器"
                selectedKeys={storageType ? [storageType] : []}
                size="md"
                startContent={<Database className="w-4 h-4" />}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0] as string

                  setStorageType(key)
                  setCurrentPath('')
                }}
              >
                {providers.map((provider) => (
                  <SelectItem key={provider.storage_type}>
                    {provider.storage_type}
                  </SelectItem>
                ))}
              </Select>

              {/* 路径导航 */}
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
                      if (e.key === 'Enter') {
                        handleTogglePathInput()
                      }
                    }}
                    onValueChange={setPathInputValue}
                  />
                ) : (
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide min-w-0 flex-1">
                    {breadcrumbs.map((breadcrumb, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 flex-shrink-0"
                      >
                        {index > 0 && (
                          <span className="text-foreground-400 flex-shrink-0">
                            /
                          </span>
                        )}
                        <Button
                          className="h-6 px-1 min-w-0 text-xs whitespace-nowrap flex-shrink-0"
                          size="sm"
                          variant="light"
                          onPress={() => setCurrentPath(breadcrumb.path)}
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
                  onPress={handleTogglePathInput}
                >
                  {showPathInput ? '跳转' : '跳转至指定路径'}
                </Button>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  color="primary"
                  isDisabled={!storageType}
                  size="sm"
                  startContent={<FolderPlus className="w-4 h-4" />}
                  variant="solid"
                  onPress={handleCreateFolder}
                >
                  新建文件夹
                </Button>
                <Button
                  color="success"
                  isDisabled={!storageType || loadingStates.upload}
                  size="sm"
                  startContent={<Upload className="w-4 h-4" />}
                  variant="solid"
                  onPress={handleUpload}
                >
                  {loadingStates.upload ? '上传中...' : '上传文件'}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-foreground-500">
                  显示隐藏文件
                </span>
                <Switch
                  aria-label="显示隐藏文件"
                  isSelected={showHiddenFiles}
                  size="sm"
                  onValueChange={setShowHiddenFiles}
                />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 文件列表 */}
      <Card radius="lg" shadow="sm">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <Table
              isStriped
              removeWrapper
              aria-label="文件列表"
              classNames={{
                th: 'bg-default-100 text-xs sm:text-sm',
                td: 'py-2 sm:py-3 text-xs sm:text-sm',
              }}
              sortDescriptor={fileList.sortDescriptor}
              onSortChange={fileList.sort}
            >
              <TableHeader columns={TABLE_COLUMNS}>
                {(column) => (
                  <TableColumn
                    key={column.key}
                    allowsSorting={
                      column.key === 'name' ||
                      column.key === 'mod_time' ||
                      column.key === 'size'
                    }
                    className={column.className}
                    width={column.width || null}
                  >
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                emptyContent="此目录为空"
                isLoading={fileList.isLoading}
                items={items}
                loadingContent={<Spinner label="加载中..." />}
              >
                {(file) => (
                  <TableRow
                    key={file.path}
                    className="group cursor-pointer hover:bg-content2"
                    onClick={() => handleFileClick(file)}
                  >
                    {(columnKey) => {
                      switch (columnKey) {
                        case 'name':
                          return (
                            <TableCell>
                              <div className="flex items-center gap-2 sm:gap-3">
                                {getFileIcon(file)}
                                <div className="min-w-0 flex-1">
                                  <span className="font-medium text-xs sm:text-sm truncate block">
                                    {file.name}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                          )
                        case 'size':
                          return (
                            <TableCell className="hidden sm:table-cell">
                              {file.size ? formatFileSize(file.size) : '-'}
                            </TableCell>
                          )
                        case 'mod_time':
                          return (
                            <TableCell className="hidden sm:table-cell">
                              <span className="text-xs sm:text-sm text-foreground-500">
                                {formatDate(file.mod_time ?? '')}
                              </span>
                            </TableCell>
                          )
                        case 'actions':
                          return (
                            <TableCell>
                              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 ease">
                                <Button
                                  isIconOnly
                                  aria-label="识别媒体"
                                  size="sm"
                                  variant="light"
                                  onPress={() =>
                                    handleRecognizeSelectedMedia(file)
                                  }
                                >
                                  <ScanSearch className="w-3 h-3 sm:w-4 sm:h-4" />
                                </Button>
                                {file.type !== 'Directory' && (
                                  <Button
                                    isIconOnly
                                    aria-label="下载"
                                    size="sm"
                                    variant="light"
                                    onPress={() => handleDownload(file)}
                                  >
                                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </Button>
                                )}
                                <Button
                                  isIconOnly
                                  aria-label="复制"
                                  size="sm"
                                  variant="light"
                                  onPress={() => openCopyModal(file)}
                                >
                                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                                </Button>
                                <Button
                                  isIconOnly
                                  aria-label="移动"
                                  size="sm"
                                  variant="light"
                                  onPress={() => openMoveModal(file)}
                                >
                                  <Move className="w-3 h-3 sm:w-4 sm:h-4" />
                                </Button>
                                <Button
                                  isIconOnly
                                  aria-label="删除"
                                  size="sm"
                                  variant="light"
                                  onPress={() => handleDelete(file)}
                                >
                                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-danger" />
                                </Button>
                              </div>
                            </TableCell>
                          )
                        default:
                          return (
                            <TableCell>
                              {getKeyValue(file, columnKey as string)}
                            </TableCell>
                          )
                      }
                    }}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* 分页组件 */}
          {filteredItems?.length > 0 && (
            <div className="flex justify-center py-3 sm:py-4">
              <Pagination
                showControls
                showShadow
                color="primary"
                page={page}
                size="sm"
                total={pages}
                onChange={setPage}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
