import type { StorageProviderInterface, TransferType } from '@/types/storage'

import { Card, CardBody, CardHeader } from '@heroui/card'
import { Input, Textarea } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Button } from '@heroui/button'
import { Tabs, Tab } from '@heroui/tabs'
import { Spinner } from '@heroui/spinner'
import { Tooltip } from '@heroui/tooltip'
import { Checkbox } from '@heroui/checkbox'
import { FileText, Image, Video, Info } from 'lucide-react'
import { useState, useEffect } from 'react'

import { LogLevel } from '@/types'
import {
  useLogConfig,
  useTMDBConfig,
  useFanartConfig,
  useMediaConfig,
} from '@/hooks'
import { StorageService } from '@/services/storage'

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState('log')

  return (
    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
      {/* 标签页工具栏 */}
      <Card radius="lg" shadow="sm">
        <div className="p-3 sm:p-4">
          <Tabs
            aria-label="设置选项"
            classNames={{
              tabList: 'gap-2',
              tab: 'text-sm',
            }}
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
          >
            <Tab
              key="log"
              title={
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">日志配置</span>
                  <span className="sm:hidden">日志</span>
                </div>
              }
            />
            <Tab
              key="scrape"
              title={
                <div className="flex items-center space-x-2">
                  <Image className="w-4 h-4" />
                  <span className="hidden sm:inline">刮削配置</span>
                  <span className="sm:hidden">刮削</span>
                </div>
              }
            />
            <Tab
              key="media"
              title={
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4" />
                  <span className="hidden sm:inline">媒体库配置</span>
                  <span className="sm:hidden">媒体</span>
                </div>
              }
            />
          </Tabs>
        </div>
      </Card>

      {/* 设置内容（随 tabs 切换） */}
      <Card radius="lg" shadow="sm">
        {selectedTab === 'log' && <LogSettings />}
        {selectedTab === 'scrape' && <ScrapeSettings />}
        {selectedTab === 'media' && <MediaSettings />}
      </Card>
    </div>
  )
}

// 日志配置组件
function LogSettings() {
  const { logConfig, loading, loadData, updateData, updateConfig } =
    useLogConfig()

  const logLevels = [
    { label: 'Debug', value: 'debug' },
    { label: 'Info', value: 'info' },
    { label: 'Warning', value: 'warning' },
    { label: 'Error', value: 'error' },
  ]

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading && !logConfig) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner label="加载配置中..." />
      </div>
    )
  }

  if (!logConfig) {
    return (
      <div className="p-3 sm:p-4">
        <p className="text-center text-foreground-500">无法加载日志配置</p>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="终端日志级别"
          placeholder="选择日志级别"
          selectedKeys={
            logConfig.console_level ? [logConfig.console_level] : []
          }
          onSelectionChange={(keys) =>
            updateConfig({
              console_level: Array.from(keys)[0] as LogLevel,
            })
          }
        >
          {logLevels.map((level) => (
            <SelectItem key={level.value}>{level.label}</SelectItem>
          ))}
        </Select>

        <Select
          label="文件日志级别"
          placeholder="选择日志级别"
          selectedKeys={logConfig.file_level ? [logConfig.file_level] : []}
          onSelectionChange={(keys) =>
            updateConfig({
              file_level: Array.from(keys)[0] as LogLevel,
            })
          }
        >
          {logLevels.map((level) => (
            <SelectItem key={level.value}>{level.label}</SelectItem>
          ))}
        </Select>
      </div>

      <Input
        label="日志文件目录"
        placeholder="输入日志文件目录路径"
        value={logConfig.file_dir || ''}
        onValueChange={(value) => updateConfig({ file_dir: value })}
      />

      <div className="flex justify-end">
        <Button color="primary" isLoading={loading} onPress={updateData}>
          {loading ? '保存中...' : '保存配置'}
        </Button>
      </div>
    </div>
  )
}

// 刮削配置组件
function ScrapeSettings() {
  const {
    tmdbConfig,
    loading: tmdbLoading,
    loadData: loadTmdbData,
    updateData: updateTmdbData,
    updateConfig: updateTmdbConfig,
    tmdbLanguageOptions,
    imageLanguageOptions,
  } = useTMDBConfig()
  const {
    fanartConfig,
    loading: fanartLoading,
    loadData: loadFanartData,
    updateData: updateFanartData,
    updateConfig: updateFanartConfig,
    fanartLanguageOptions,
  } = useFanartConfig()

  useEffect(() => {
    loadTmdbData()
    loadFanartData()
  }, [loadTmdbData, loadFanartData])

  const loading = tmdbLoading || fanartLoading

  if (loading && !tmdbConfig && !fanartConfig) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner label="加载配置中..." />
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 space-y-6 sm:space-y-8">
      {/* TMDB 设置 */}
      <Card radius="lg" shadow="sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold">TMDB 设置</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          <Input
            label="TMDB API Key"
            placeholder="输入 TMDB API Key"
            type="password"
            value={tmdbConfig?.api_key || ''}
            onValueChange={(value) => updateTmdbConfig({ api_key: value })}
          />
          <Input
            label="TMDB API URL"
            placeholder="输入 TMDB API URL"
            value={tmdbConfig?.api_url || ''}
            onValueChange={(value) => updateTmdbConfig({ api_url: value })}
          />
          <Input
            label="TMDB 图片 URL"
            placeholder="输入 TMDB 图片 URL"
            value={tmdbConfig?.image_url || ''}
            onValueChange={(value) => updateTmdbConfig({ image_url: value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="语言设置"
              placeholder="选择语言"
              selectedKeys={tmdbConfig?.language ? [tmdbConfig.language] : []}
              onSelectionChange={(keys) =>
                updateTmdbConfig({ language: Array.from(keys)[0] as string })
              }
            >
              {tmdbLanguageOptions.map((opt) => (
                <SelectItem key={opt.value}>{opt.label}</SelectItem>
              ))}
            </Select>

            <Select
              label="图片语言（可多选）"
              placeholder="选择图片语言"
              selectedKeys={
                tmdbConfig?.include_image_language
                  ? tmdbConfig.include_image_language
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                  : []
              }
              selectionMode="multiple"
              onSelectionChange={(keys) => {
                if (keys === 'all') {
                  updateTmdbConfig({
                    include_image_language: imageLanguageOptions
                      .map((o) => o.value)
                      .join(','),
                  })
                } else {
                  updateTmdbConfig({
                    include_image_language: Array.from(keys).join(','),
                  })
                }
              }}
            >
              {imageLanguageOptions.map((opt) => (
                <SelectItem key={opt.value}>{opt.label}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex justify-end">
            <Button
              color="primary"
              isLoading={tmdbLoading}
              onPress={updateTmdbData}
            >
              {tmdbLoading ? '保存中...' : '保存 TMDB 配置'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Fanart 设置 */}
      <Card radius="lg" shadow="sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold">Fanart 设置</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          <Input
            label="Fanart API Key"
            placeholder="输入 Fanart API Key"
            type="password"
            value={fanartConfig?.api_key || ''}
            onValueChange={(value) => updateFanartConfig({ api_key: value })}
          />
          <Input
            label="Fanart API URL"
            placeholder="输入 Fanart API URL"
            value={fanartConfig?.api_url || ''}
            onValueChange={(value) => updateFanartConfig({ api_url: value })}
          />
          <Select
            label="语言（可多选）"
            placeholder="选择语言"
            selectedKeys={fanartConfig?.languages || []}
            selectionMode="multiple"
            onSelectionChange={(keys) => {
              if (keys === 'all') {
                updateFanartConfig({
                  languages: fanartLanguageOptions.map((o) => o.value),
                })
              } else {
                updateFanartConfig({ languages: Array.from(keys).map(String) })
              }
            }}
          >
            {fanartLanguageOptions.map((opt) => (
              <SelectItem key={opt.value}>{opt.label}</SelectItem>
            ))}
          </Select>
          <div className="flex justify-end">
            <Button
              color="primary"
              isLoading={fanartLoading}
              onPress={updateFanartData}
            >
              {fanartLoading ? '保存中...' : '保存 Fanart 配置'}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

// 媒体库配置组件
function MediaSettings() {
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

  // 自定义识别词提示内容
  const identifyWordHints: string[] = [
    '屏蔽词',
    '被替换词 => 替换词',
    '前定位词 <> 后定位词 >> 集偏移量（EP）',
    '被替换词 => 替换词 && 前定位词 <> 后定位词 >> 集偏移量（EP）',
    '（其中<被替换词>支持正则表达式，其余不支持，单独一个<被替换词>则会被替换为空字符串）',
  ]

  // 媒体库配置（提供者 + 列表 + 传输类型校验）
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
    <div className="p-3 sm:p-4 space-y-6 sm:space-y-8">
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

          {libraries.length === 0 ? (
            <div className="text-center py-8 text-foreground-500">
              暂无媒体库配置
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {libraries.map((lib, idx) => (
                <Card key={idx} radius="lg" shadow="sm">
                  <CardBody className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {lib.name || '未命名媒体库'}
                      </span>
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
                      isDisabled={loadingProviders || providers.length === 0}
                      label="源存储类型"
                      selectedKeys={lib.src_type ? [lib.src_type] : []}
                      onSelectionChange={(keys) => {
                        const val = Array.from(keys)[0] as string

                        setLibraries((prev) => {
                          const next = [...prev]

                          next[idx] = { ...next[idx], src_type: val as any }

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
                      isDisabled={loadingProviders || providers.length === 0}
                      label="目标存储类型"
                      selectedKeys={lib.dst_type ? [lib.dst_type] : []}
                      onSelectionChange={(keys) => {
                        const val = Array.from(keys)[0] as string

                        setLibraries((prev) => {
                          const next = [...prev]

                          next[idx] = { ...next[idx], dst_type: val as any }

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
                        <SelectItem key={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </Select>

                    <div className="grid grid-cols-2 gap-2">
                      <Checkbox
                        isSelected={lib.organize_by_type}
                        size="md"
                        onValueChange={(val) =>
                          setLibraries((prev) => {
                            const next = [...prev]

                            next[idx] = { ...next[idx], organize_by_type: val }

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
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
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
