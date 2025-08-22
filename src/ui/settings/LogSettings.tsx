import type { LogLevel } from '@/types'

import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { ClipboardClock } from 'lucide-react'

import {
  BaseSettingsCard,
  LoadingSpinner,
  ErrorMessage,
} from './BaseSettingsCard'
import { LOG_LEVELS, SETTINGS_STYLES } from './constants'

import { useLogConfig, useSettingsLoader } from '@/hooks/settings'

export function LogSettings() {
  const { logConfig, loading, loadData, updateData, updateConfig } =
    useLogConfig()

  useSettingsLoader({ loadData })

  if (loading && !logConfig) {
    return <LoadingSpinner />
  }

  if (!logConfig) {
    return <ErrorMessage message="无法加载日志配置" />
  }

  return (
    <BaseSettingsCard
      icon={ClipboardClock}
      loading={loading}
      title="日志设置"
      onSave={updateData}
    >
      <div className={SETTINGS_STYLES.grid}>
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
          {LOG_LEVELS.map((level) => (
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
          {LOG_LEVELS.map((level) => (
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
    </BaseSettingsCard>
  )
}
