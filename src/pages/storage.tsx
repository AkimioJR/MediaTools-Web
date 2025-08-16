import type { FileInfo, StorageProviderInterface } from '@/types/storage'

import { Card, CardBody } from '@heroui/card'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/table'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
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
} from 'lucide-react'
import { useState, useEffect } from 'react'

import { StorageService } from '@/services/storage'
import { showSuccess, handleApiError } from '@/utils/message'
import { useModal } from '@/components/modal-provider'

export default function StoragePage() {
  const [currentPath, setCurrentPath] = useState('/')
  const [storageType, setStorageType] = useState('')
  const [files, setFiles] = useState<FileInfo[]>([])
  const [providers, setProviders] = useState<StorageProviderInterface[]>([])
  const [loading, setLoading] = useState(false)

  // 全局模态
  const { openModal } = useModal()

  // 上传状态
  const [uploading, setUploading] = useState(false)

  // 分页状态
  const [page, setPage] = useState(1)
  const rowsPerPage = 20

  // 加载存储提供者列表
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

  // 加载文件列表
  useEffect(() => {
    if (!storageType) return

    const loadFiles = async () => {
      setLoading(true)
      try {
        const fileList = await StorageService.ListDetail(
          storageType,
          currentPath,
        )

        setFiles(fileList)
      } catch (error) {
        handleApiError(error, '加载文件列表失败')
      } finally {
        setLoading(false)
      }
    }

    loadFiles()
  }, [currentPath, storageType])

  // 生成面包屑导航数据
  const getBreadcrumbs = () => {
    const parts = currentPath.split('/').filter(Boolean)
    const breadcrumbs = [{ title: '根目录', path: '/' }]

    let fullPath = ''

    parts.forEach((part) => {
      fullPath += `/${part}`
      breadcrumbs.push({ title: part, path: fullPath })
    })

    return breadcrumbs
  }

  // 重新加载文件列表
  const reloadFiles = async () => {
    if (!storageType) return

    setLoading(true)
    try {
      const fileList = await StorageService.ListDetail(storageType, currentPath)

      setFiles(fileList)
    } catch (error) {
      handleApiError(error, '重新加载文件列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 文件操作处理函数
  const handleFileClick = (file: FileInfo) => {
    if (file.is_dir) {
      setCurrentPath(file.path)
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

  const handleDownload = async (file: FileInfo) => {
    try {
      await StorageService.DownloadFile(storageType, file.path, file.name)
      showSuccess('文件下载开始')
    } catch (error) {
      handleApiError(error, '文件下载失败')
    }
  }

  const handleDelete = async (file: FileInfo) => {
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

  const openCopyModal = async (file: FileInfo) => {
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

  const openMoveModal = async (file: FileInfo) => {
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

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  // 格式化日期
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  // 获取文件图标
  const getFileIcon = (file: FileInfo) => {
    if (file.is_dir) {
      return <Folder className="w-5 h-5 text-amber-500" />
    }

    return <File className="w-5 h-5 text-gray-500" />
  }

  // 分页逻辑
  const pages = Math.ceil(files.length / rowsPerPage)
  const items = files.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  // 当文件列表变化时，重置到第一页
  useEffect(() => {
    setPage(1)
  }, [files.length])

  return (
    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
      {/* 操作工具栏 */}
      <Card radius="lg" shadow="sm">
        <CardBody className="p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* 存储器选择和路径导航 */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
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
                  setCurrentPath('/') // 切换存储器时重置路径
                }}
              >
                {providers.map((provider) => (
                  <SelectItem key={provider.storage_type}>
                    {provider.storage_type}
                  </SelectItem>
                ))}
              </Select>

              {/* 路径导航 */}
              <div className="flex items-center gap-2 p-2 bg-content2 rounded-lg flex-1 min-w-0">
                <span className="text-xs sm:text-sm text-foreground-500 whitespace-nowrap flex-shrink-0">
                  当前路径:
                </span>
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
                        className="h-6 px-2 min-w-0 text-xs whitespace-nowrap flex-shrink-0"
                        size="sm"
                        variant="light"
                        onPress={() => setCurrentPath(breadcrumb.path)}
                      >
                        {breadcrumb.title}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
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
            >
              <TableHeader>
                <TableColumn>名称</TableColumn>
                <TableColumn className="hidden sm:table-cell">大小</TableColumn>
                <TableColumn className="hidden md:table-cell">
                  修改时间
                </TableColumn>
                <TableColumn className="sm:w-[200px]" width={120}>
                  操作
                </TableColumn>
              </TableHeader>
              <TableBody
                emptyContent="此目录为空"
                isLoading={loading}
                loadingContent="加载中..."
              >
                {items.map((file) => (
                  <TableRow
                    key={file.path}
                    className="cursor-pointer hover:bg-content2"
                    onClick={() => handleFileClick(file)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2 sm:gap-3">
                        {getFileIcon(file)}
                        <div className="min-w-0 flex-1">
                          <span className="font-medium text-xs sm:text-sm truncate block">
                            {file.name}
                          </span>
                          {/* 移动端显示文件大小 */}
                          <span className="text-xs text-foreground-500 sm:hidden">
                            {file.is_dir ? '文件夹' : formatFileSize(file.size)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {file.is_dir ? '-' : formatFileSize(file.size)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-xs sm:text-sm text-foreground-500">
                        {formatDate(file.mod_time)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {!file.is_dir && (
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 分页组件 */}
          {files.length > 0 && (
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
