import { Card, CardBody, CardHeader } from '@heroui/card'
import { Switch } from '@heroui/switch'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Button } from '@heroui/button'
import { FileText, Image, Video, Settings } from 'lucide-react'
import { useState } from 'react'

import { PageToolbar } from '@/components/page-toolbar'

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState('log')

  // 使用 tabsOnly 模式，工具栏不显示统计与按钮

  return (
    <div className="p-6 space-y-6">
      {/* 页面工具栏（含 Tabs） */}
      <PageToolbar
        tabsOnly
        selectedTabKey={selectedTab}
        tabs={[
          {
            key: 'log',
            label: '日志配置',
            icon: <FileText className="w-4 h-4" />,
          },
          {
            key: 'scrape',
            label: '刮削配置',
            icon: <Image className="w-4 h-4" />,
          },
          {
            key: 'media',
            label: '媒体库配置',
            icon: <Video className="w-4 h-4" />,
          },
        ]}
        onTabChange={(key) => setSelectedTab(key)}
      />

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
  const [consoleLevel, setConsoleLevel] = useState('info')
  const [fileLevel, setFileLevel] = useState('debug')
  const [fileDir, setFileDir] = useState('/var/log/mediatools')

  const logLevels = [
    { label: 'Debug', value: 'debug' },
    { label: 'Info', value: 'info' },
    { label: 'Warning', value: 'warning' },
    { label: 'Error', value: 'error' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="终端日志级别"
          placeholder="选择日志级别"
          selectedKeys={[consoleLevel]}
          variant="bordered"
          onSelectionChange={(keys) =>
            setConsoleLevel(Array.from(keys)[0] as string)
          }
        >
          {logLevels.map((level) => (
            <SelectItem key={level.value}>{level.label}</SelectItem>
          ))}
        </Select>

        <Select
          label="文件日志级别"
          placeholder="选择日志级别"
          selectedKeys={[fileLevel]}
          variant="bordered"
          onSelectionChange={(keys) =>
            setFileLevel(Array.from(keys)[0] as string)
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
        value={fileDir}
        variant="bordered"
        onValueChange={setFileDir}
      />

      <div className="flex justify-end">
        <Button color="primary" onPress={() => console.log('保存日志配置')}>
          保存配置
        </Button>
      </div>
    </div>
  )
}

// 刮削配置组件
function ScrapeSettings() {
  const [tmdbApiKey, setTmdbApiKey] = useState('')
  const [fanartApiKey, setFanartApiKey] = useState('')
  const [autoScrape, setAutoScrape] = useState(true)

  return (
    <div className="p-6 space-y-8">
      {/* TMDB 设置 */}
      <Card radius="lg" shadow="sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">TMDB 设置</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          <Input
            label="TMDB API Key"
            placeholder="输入 TMDB API Key"
            type="password"
            value={tmdbApiKey}
            variant="bordered"
            onValueChange={setTmdbApiKey}
          />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">自动刮削</p>
              <p className="text-sm text-foreground-500">
                上传文件时自动获取元数据
              </p>
            </div>
            <Switch
              color="primary"
              isSelected={autoScrape}
              onValueChange={setAutoScrape}
            />
          </div>
        </CardBody>
      </Card>

      {/* Fanart 设置 */}
      <Card radius="lg" shadow="sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Fanart 设置</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <Input
            label="Fanart API Key"
            placeholder="输入 Fanart API Key"
            type="password"
            value={fanartApiKey}
            variant="bordered"
            onValueChange={setFanartApiKey}
          />
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <Button color="primary" onPress={() => console.log('保存刮削配置')}>
          保存配置
        </Button>
      </div>
    </div>
  )
}

// 媒体库配置组件
function MediaSettings() {
  const [renameFormat, setRenameFormat] = useState('{title} ({year})')
  const [libraryPath, setLibraryPath] = useState('/media/movies')
  const [customWords, setCustomWords] = useState('')

  return (
    <div className="p-6 space-y-8">
      {/* 媒体库重命名格式 */}
      <Card radius="lg" shadow="sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">媒体库重命名格式</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          <Input
            label="重命名格式"
            placeholder="例如: {title} ({year})"
            value={renameFormat}
            variant="bordered"
            onValueChange={setRenameFormat}
          />
          <p className="text-sm text-foreground-500">
            支持变量: {'{title}'}, {'{year}'}, {'{genre}'}, {'{quality}'}
          </p>
        </CardBody>
      </Card>

      {/* 媒体库配置 */}
      <Card radius="lg" shadow="sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">媒体库配置</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-4">
          <Input
            label="媒体库路径"
            placeholder="输入媒体库根目录路径"
            value={libraryPath}
            variant="bordered"
            onValueChange={setLibraryPath}
          />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">自动扫描</p>
              <p className="text-sm text-foreground-500">定期扫描媒体库目录</p>
            </div>
            <Switch defaultSelected color="primary" />
          </div>
        </CardBody>
      </Card>

      {/* 自定义词条配置 */}
      <Card radius="lg" shadow="sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">自定义词条配置</h3>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <Input
            label="自定义词条"
            placeholder="输入自定义词条，每行一个"
            type="textarea"
            value={customWords}
            variant="bordered"
            onValueChange={setCustomWords}
          />
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <Button color="primary" onPress={() => console.log('保存媒体库配置')}>
          保存配置
        </Button>
      </div>
    </div>
  )
}
