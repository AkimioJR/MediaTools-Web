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
import { useState, useEffect } from 'react'
import { useAsyncList } from '@react-stately/data'

import { StorageService } from '@/services/storage'
import { showSuccess, handleApiError } from '@/utils/message'
import { useModal } from '@/components/modal-provider'
import { MediaRecognitionDialog } from '@/components/media-recognition-dialog'

export default function StoragePage() {
  const [currentPath, setCurrentPath] = useState('')
  const [storageType, setStorageType] = useState('')
  const [providers, setProviders] = useState<StorageProviderInterface[]>([])
  const [showPathInput, setShowPathInput] = useState(false)
  const [pathInputValue, setPathInputValue] = useState('')

  const getSavedSortDescriptor = () => {
    try {
      const saved = localStorage.getItem('storage-table-sort')

      return saved
        ? JSON.parse(saved)
        : { column: 'name', direction: 'ascending' }
    } catch (_) {
      return { column: 'name', direction: 'ascending' }
    }
  }

  const fileList = useAsyncList<StorageFileInfo>({
    async load({}) {
      if (!storageType) {
        return { items: [] }
      }

      try {
        const files = await StorageService.List(storageType, currentPath, true)

        // 有些item没有size 属性 重置为0
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
          'storage-table-sort',
          JSON.stringify(sortDescriptor),
        )
      }

      return {
        items: items.sort((a, b) => {
          const column = sortDescriptor.column
          const isAscending = sortDescriptor.direction === 'ascending'

          // 特殊处理文件夹和文件的比较
          const isADirectory = a.type === 'Directory'
          const isBDirectory = b.type === 'Directory'

          // // 如果按名称排序，则文件夹和文件混合排序
          // // 如果按大小或日期排序，则文件夹始终在前
          // if (column !== 'name' && isADirectory !== isBDirectory) {
          //   return isADirectory ? -1 : 1
          // }

          let result

          switch (column) {
            case 'name':
              result = a.name.localeCompare(b.name)
              break

            case 'mod_time':
              // 日期排序：转换为时间戳进行比较
              const aTime = a.mod_time ? new Date(a.mod_time).getTime() : 0
              const bTime = b.mod_time ? new Date(b.mod_time).getTime() : 0

              result = aTime - bTime
              break

            case 'size':
              const aSize = isADirectory ? 0 : Number(a.size || 0)
              const bSize = isBDirectory ? 0 : Number(b.size || 0)

              result = aSize - bSize
              break

            default:
              result = 0
          }

          return isAscending ? result : -result
        }),
      }
    },
    getKey: (item) => item.path,
    initialSortDescriptor: getSavedSortDescriptor(),
  })

  const { openModal } = useModal()

  const [uploading, setUploading] = useState(false)

  const getShowHiddenFilesSetting = () => {
    try {
      const saved = localStorage.getItem('storage-show-hidden-files')

      return saved === 'true'
    } catch (_) {
      return false
    }
  }

  const [showHiddenFiles, setShowHiddenFiles] = useState(
    getShowHiddenFilesSetting(),
  )

  const [page, setPage] = useState(1)
  const rowsPerPage = 20

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const providerList =
          await StorageService.ProviderService.getProviderList()

        setProviders(providerList)
        if (providerList.length > 0) {
          setStorageType(providerList[0].storage_type)
        }
      } catch (error) {
        handleApiError(error, '加载存储提供者失败')
      }
    }

    loadProviders()
  }, [])

  useEffect(() => {
    if (storageType) {
      fileList.reload()
    }
  }, [currentPath, storageType])

  const isWinRootPath = (path: string) => {
    return path.endsWith(':')
  }

  const getBreadcrumbs = () => {
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
  }

  const reloadFiles = async () => {
    await fileList.reload()
  }

  const handleFileClick = (file: StorageFileInfo) => {
    if (file.type === 'Directory') {
      setCurrentPath(file.path)
    }
  }

  const handleTogglePathInput = () => {
    if (showPathInput) {
      if (pathInputValue.trim()) {
        setCurrentPath(pathInputValue.trim())
      }
      setShowPathInput(false)
    } else {
      setPathInputValue(currentPath)
      setShowPathInput(true)
    }
  }

  const handleCreateFolder = async () => {
    const name = prompt('请输入文件夹名称:')

    if (name && storageType) {
      try {
        const folderPath = currentPath.endsWith('/')
          ? currentPath + name
          : currentPath + '/' + name

        await StorageService.Mkdir(storageType, folderPath)
        showSuccess('文件夹创建成功')
        await reloadFiles()
      } catch (error) {
        handleApiError(error, '文件夹创建失败')
      }
    }
  }

  const handleUpload = () => {
    const input = document.createElement('input')

    input.type = 'file'
    input.multiple = true
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files

      if (files && storageType) {
        setUploading(true)

        try {
          for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const targetPath = currentPath.endsWith('/')
              ? currentPath + file.name
              : currentPath + '/' + file.name

            await StorageService.Upload(storageType, targetPath, file)
          }

          showSuccess(`成功上传 ${files.length} 个文件`)
          await reloadFiles()
        } catch (error) {
          handleApiError(error, '文件上传失败')
        } finally {
          setUploading(false)
        }
      }
    }
    input.click()
  }

  const handleRecognizeSelectedMedia = async (file: StorageFileInfo) => {
    await openModal(() => <MediaRecognitionDialog defaultValue={file.name} />, {
      title: '媒体识别',
      size: window.innerWidth < 768 ? '3xl' : '4xl',
    })
  }

  const handleDownload = async (file: StorageFileInfo) => {
    try {
      await StorageService.DownloadFile(storageType, file.path, file.name)
      showSuccess('文件下载开始')
    } catch (error) {
      handleApiError(error, '文件下载失败')
    }
  }

  const handleDelete = async (file: StorageFileInfo) => {
    if (confirm(`确定要删除 "${file.name}" 吗？`)) {
      try {
        await StorageService.Delete(storageType, file.path)
        showSuccess('文件删除成功')
        await reloadFiles()
      } catch (error) {
        handleApiError(error, '文件删除失败')
      }
    }
  }

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
    try {
      await StorageService.Copy(
        storageType,
        file.path,
        result.provider,
        result.path,
      )
      showSuccess('文件复制成功')
      await reloadFiles()
    } catch (error) {
      handleApiError(error, '文件复制失败')
    }
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
    try {
      await StorageService.Move(
        storageType,
        file.path,
        result.provider,
        result.path,
      )
      showSuccess('文件移动成功')
      await reloadFiles()
    } catch (error) {
      handleApiError(error, '文件移动失败')
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

  const getFileIcon = (file: StorageFileInfo) => {
    if (file.type === 'Directory') {
      return <Folder className="w-5 h-5 text-amber-500" />
    }

    return <File className="w-5 h-5 text-gray-500" />
  }

  const filteredItems = showHiddenFiles
    ? fileList.items
    : fileList.items.filter((file) => !file.name.startsWith('.'))

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  // 当过滤条件改变导致总页数减少，且当前页码超出总页数时，自动调整页码
  useEffect(() => {
    if (page > pages && pages > 0) {
      setPage(pages)
    }
  }, [pages, page])

  const items = filteredItems.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  )

  const columns = [
    {
      key: 'name',
      label: '名称',
    },
    {
      key: 'size',
      label: '大小',
      className: 'hidden sm:table-cell',
    },
    {
      key: 'mod_time',
      label: '修改时间',
      className: 'hidden sm:table-cell',
    },
    {
      key: 'actions',
      className: 'sm:w-[200px]',
      label: '操作',
      width: 120,
    },
  ]

  useEffect(() => {
    setPage(1)
  }, [fileList.items.length])

  useEffect(() => {
    localStorage.setItem(
      'storage-show-hidden-files',
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
                    {getBreadcrumbs().map((breadcrumb, index) => (
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
                  isDisabled={!storageType || uploading}
                  size="sm"
                  startContent={<Upload className="w-4 h-4" />}
                  variant="solid"
                  onPress={handleUpload}
                >
                  {uploading ? '上传中...' : '上传文件'}
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
              <TableHeader columns={columns}>
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
          {filteredItems.length > 0 && (
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
