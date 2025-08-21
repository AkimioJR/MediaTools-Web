import type { LogLevel } from '@/types'

import { Card, CardBody, CardHeader } from '@heroui/card'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Button } from '@heroui/button'
import { Spinner } from '@heroui/spinner'
import { Save, ClipboardClock } from 'lucide-react'
import { useEffect } from 'react'

import { useLogConfig } from '@/hooks/settings'
import { ButtonIcon } from '@/components/icon'

export function LogSettings() {
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
    <Card radius="lg" shadow="sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <ClipboardClock className="w-5 h-5 text-primary" />
          <h3 className="text-base sm:text-lg font-semibold">日志设置</h3>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
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
            <Button
              color="primary"
              isLoading={loading}
              startContent={<ButtonIcon icon={Save} />}
              variant="shadow"
              onPress={updateData}
            >
              {loading ? '保存中...' : '保存'}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
