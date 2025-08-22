import type { StorageFileInfo } from '@/types/storage'

import { Card, CardBody } from '@heroui/card'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/table'
import { Spinner } from '@heroui/spinner'
import { File, Folder } from 'lucide-react'
import { useState, useEffect, useCallback, useMemo } from 'react'

import { useDataSort } from '@/hooks/storage'
import { StorageService } from '@/services/storage'
import { showSuccess, handleApiError } from '@/utils/message'
import { useModal } from '@/components/modal-provider'
import { useConfirmModal } from '@/hooks/useConfirmModal'
import { MediaRecognitionDialog } from '@/components/media-recognition-dialog'
import {
  Toolbar,
  CopyMoveForm,
  FileActions,
  ManualSortingForm,
  type SortMode,
  type SortOptionType,
} from '@/ui/storage'
import { CreateFolder } from '@/ui/storage/CreateFolder'
import { useAppStore } from '@/stores/useAppStore'

interface FileColumn {
  key: string
  label: string
  className?: string
}

interface LoadingStates {
  files: boolean
  upload: boolean
  delete: boolean
  copy: boolean
  move: boolean
}

const STORAGE_KEYS = {
  SORT_DESCRIPTOR: 'storage-table-sort',
  SHOW_HIDDEN_FILES: 'storage-show-hidden-files',
} as const

const TABLE_COLUMNS: FileColumn[] = [
  { key: 'name', label: '名称' },
  // { key: 'size', label: '大小', className: 'hidden sm:table-cell' },
  // { key: 'mod_time', label: '修改时间', className: 'hidden sm:table-cell' },
  { key: 'actions', label: '操作' },
]

const getShowHiddenFilesSetting = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SHOW_HIDDEN_FILES)

    return saved === 'true'
  } catch {
    return false
  }
}

const isWinRootPath = (path: string) => path.endsWith(':')

export default function StoragePage() {
  const { providers } = useAppStore()

  const [currentPath, setCurrentPath] = useState('')
  const [storageType, setStorageType] = useState('')
  const [filesData, setFilesData] = useState<StorageFileInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentSortMode, setCurrentSortMode] = useState<SortMode>('name_asc')

  const [showPathInput, setShowPathInput] = useState(false)
  const [pathInputValue, setPathInputValue] = useState('')
  const [showHiddenFiles, setShowHiddenFiles] = useState(
    getShowHiddenFilesSetting,
  )

  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    files: false,
    upload: false,
    delete: false,
    copy: false,
    move: false,
  })

  const { openModal } = useModal()
  const { open: openConfirmModal } = useConfirmModal()
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

  const needDetail = useMemo(
    () => ['mod_time_asc', 'mod_time_desc'].includes(currentSortMode),
    [currentSortMode],
  )

  const fetchFiles = useCallback(async () => {
    if (!storageType) return

    setIsLoading(true)
    const data = await StorageService.List(storageType, currentPath, needDetail)

    setFilesData(data)
    setIsLoading(false)
  }, [storageType, currentPath, needDetail])

  useEffect(() => {
    setStorageType(providers[0]?.storage_type ?? '')
  }, [providers])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.SHOW_HIDDEN_FILES,
      showHiddenFiles.toString(),
    )
  }, [showHiddenFiles])

  const getFileIcon = useCallback((file: StorageFileInfo) => {
    if (file.type === 'Directory') {
      return <Folder className="w-5 h-5 text-amber-500" />
    }

    return <File className="w-5 h-5 text-gray-500" />
  }, [])

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
    const name = await openModal(
      (close) => <CreateFolder onSubmit={(name) => close(name)} />,
      {
        title: '创建文件夹',
      },
    )

    if (!name || !storageType) return

    await handleAsyncOperation(
      async () => {
        const folderPath = currentPath.endsWith('/')
          ? currentPath + name
          : currentPath + '/' + name

        await StorageService.Mkdir(storageType, folderPath)
        await fetchFiles()
      },
      'files',
      '文件夹创建成功',
    )
  }, [storageType, currentPath, handleAsyncOperation, fetchFiles])

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
          await fetchFiles()
        },
        'upload',
        `成功上传 ${files.length} 个文件`,
      )
    }

    input.click()
  }, [storageType, currentPath, handleAsyncOperation, fetchFiles])

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
      await openConfirmModal({
        title: `确定要删除 "${file.name}" 吗？`,
        onConfirm: () => {
          handleAsyncOperation(
            async () => {
              await StorageService.Delete(storageType, file.path)
              await fetchFiles()
            },
            'delete',
            '文件删除成功',
          )
        },
      })
    },
    [storageType, handleAsyncOperation, fetchFiles],
  )

  const openCopyModal = async (file: StorageFileInfo) => {
    const result = await openModal<
      { provider: string; path: string } | undefined
    >(
      (close) => (
        <CopyMoveForm
          defaultPath={currentPath}
          defaultProvider={storageType}
          providers={providers}
          onCancel={() => close(undefined)}
          onSubmit={(provider, path) => close({ provider, path })}
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
      },
      'copy',
      '文件复制成功',
    )
  }

  const openMoveModal = async (file: StorageFileInfo) => {
    const result = await openModal<
      { provider: string; path: string } | undefined
    >(
      (close) => (
        <CopyMoveForm
          defaultPath={currentPath}
          defaultProvider={storageType}
          providers={providers}
          onCancel={() => close(undefined)}
          onSubmit={(provider, path) => close({ provider, path })}
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
      },
      'move',
      '文件移动成功',
    )
  }

  const sortedFilesData = useDataSort(filesData, currentSortMode)

  const filteredItems = useMemo(() => {
    return showHiddenFiles
      ? sortedFilesData
      : sortedFilesData.filter((file) => !file.name.startsWith('.'))
  }, [showHiddenFiles, sortedFilesData])

  const handleSwitchSort = useCallback(
    (sortOption: SortOptionType) => {
      setCurrentSortMode(sortOption.value)
    },
    [setCurrentSortMode],
  )

  const handleManualSort = useCallback(async (file: StorageFileInfo) => {
    await openModal(() => <ManualSortingForm file={file} />, {
      title: '手动整理',
      size: '3xl',
    })
  }, [])

  return (
    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
      {/* 操作工具栏 */}
      <Card radius="lg" shadow="sm">
        <CardBody className="p-3 sm:p-4">
          <Toolbar
            breadcrumbs={breadcrumbs}
            loadingUpload={loadingStates.upload}
            pathInputValue={pathInputValue}
            providers={providers}
            showHiddenFiles={showHiddenFiles}
            showPathInput={showPathInput}
            sortMode={currentSortMode}
            storageType={storageType}
            onBreadcrumbClick={setCurrentPath}
            onCreateFolder={handleCreateFolder}
            onPathInputChange={setPathInputValue}
            onProviderChange={(key) => {
              setStorageType(key)
              setCurrentPath('')
            }}
            onToggleHidden={setShowHiddenFiles}
            onTogglePathInput={handleTogglePathInput}
            onToggleSort={handleSwitchSort}
            onUpload={handleUpload}
          />
        </CardBody>
      </Card>

      {/* 文件列表 */}
      <Card radius="lg" shadow="sm">
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <Table
              hideHeader
              isStriped
              removeWrapper
              aria-label="文件列表"
              classNames={{
                th: 'bg-default-100 text-xs sm:text-sm',
                td: 'py-2 sm:py-3 text-xs sm:text-sm',
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
                emptyContent="此目录为空"
                isLoading={isLoading}
                items={filteredItems}
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
                              {file.size
                                ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
                                : '-'}
                            </TableCell>
                          )
                        case 'mod_time':
                          return (
                            <TableCell className="hidden sm:table-cell">
                              <span className="text-xs sm:text-sm text-foreground-500">
                                {file.mod_time
                                  ? new Date(file.mod_time).toLocaleString(
                                      'zh-CN',
                                    )
                                  : ''}
                              </span>
                            </TableCell>
                          )
                        case 'actions':
                          return (
                            <TableCell width="20%">
                              <FileActions
                                file={file}
                                onCopy={openCopyModal}
                                onDelete={handleDelete}
                                onDownload={handleDownload}
                                onManualSort={handleManualSort}
                                onMove={openMoveModal}
                                onRecognize={handleRecognizeSelectedMedia}
                              />
                            </TableCell>
                          )
                        default:
                          return (
                            <TableCell>
                              {(file as any)[String(columnKey)]}
                            </TableCell>
                          )
                      }
                    }}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
