import type { LogLevel } from '@/types'

import { Card, CardBody } from '@heroui/card'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Button } from '@heroui/button'
import { Spinner } from '@heroui/spinner'
import { useEffect } from 'react'

import { useLogConfig } from '@/hooks'

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
            <Button color="primary" isLoading={loading} onPress={updateData}>
              {loading ? '保存中...' : '保存配置'}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
