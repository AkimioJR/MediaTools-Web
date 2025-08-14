import { Button } from '@heroui/button'
import { Select, SelectItem } from '@heroui/select'
import { Input } from '@heroui/input'
import { Card } from '@heroui/card'
import { Divider } from '@heroui/divider'
import { Tabs, Tab } from '@heroui/tabs'
import {
  Search,
  Filter,
  Download,
  Upload,
  Settings2,
  RefreshCw,
} from 'lucide-react'

interface ToolbarAction {
  key: string
  label: string
  icon?: React.ReactNode
  variant?:
    | 'solid'
    | 'bordered'
    | 'light'
    | 'flat'
    | 'faded'
    | 'shadow'
    | 'ghost'
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  onPress?: () => void
}

interface ToolbarSelect {
  key: string
  label: string
  placeholder?: string
  items: Array<{ key: string; label: string }>
  selectedKey?: string
  onSelectionChange?: (key: string) => void
}

interface ToolbarStats {
  label: string
  value: string | number
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
}

interface ToolbarTab {
  key: string
  label: string
  icon?: React.ReactNode
}

interface PageToolbarProps {
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  actions?: ToolbarAction[]
  selects?: ToolbarSelect[]
  stats?: ToolbarStats[]
  children?: React.ReactNode
  className?: string
  tabs?: ToolbarTab[]
  selectedTabKey?: string
  onTabChange?: (key: string) => void
  tabsOnly?: boolean
}

export function PageToolbar({
  searchPlaceholder = '搜索...',
  onSearch,
  actions = [],
  selects = [],
  stats = [],
  children,
  className = '',
  tabs = [],
  selectedTabKey,
  onTabChange,
  tabsOnly = false,
}: PageToolbarProps) {
  // 简化模式：只显示 Tabs
  if (tabsOnly) {
    return (
      <Card className={`mb-6 ${className}`} radius="lg" shadow="sm">
        <div className="p-4">
          {tabs.length > 0 && (
            <Tabs
              aria-label="页面选项"
              selectedKey={selectedTabKey}
              onSelectionChange={(key) => onTabChange?.(key as string)}
            >
              {tabs.map((t) => (
                <Tab
                  key={t.key}
                  title={
                    <div className="flex items-center space-x-2">
                      {t.icon}
                      <span>{t.label}</span>
                    </div>
                  }
                />
              ))}
            </Tabs>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card className={`mb-6 ${className}`} radius="lg" shadow="sm">
      <div className="p-4 from-content1 to-content2">
        {/* 统计信息 */}
        {stats.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-content1 rounded-xl p-4 border border-divider hover:shadow-md transition-all duration-200"
                >
                  <div className="text-xs font-medium text-foreground-500 mb-1">
                    {stat.label}
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      stat.color === 'primary'
                        ? 'text-primary'
                        : stat.color === 'success'
                          ? 'text-success'
                          : stat.color === 'warning'
                            ? 'text-warning'
                            : stat.color === 'danger'
                              ? 'text-danger'
                              : 'text-foreground'
                    }`}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
            <Divider className="mt-6" />
          </div>
        )}

        {/* 工具栏主体 */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* 左侧：标签、搜索和选择器 */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1 min-w-0">
            {/* 标签页 */}
            {tabs.length > 0 && (
              <Tabs
                aria-label="页面选项"
                selectedKey={selectedTabKey}
                onSelectionChange={(key) => onTabChange?.(key as string)}
              >
                {tabs.map((t) => (
                  <Tab
                    key={t.key}
                    title={
                      <div className="flex items-center space-x-2">
                        {t.icon}
                        <span>{t.label}</span>
                      </div>
                    }
                  />
                ))}
              </Tabs>
            )}
            {/* 搜索框 */}
            {onSearch && (
              <Input
                className="w-full sm:w-80"
                classNames={{
                  input: 'bg-transparent',
                  inputWrapper:
                    'bg-content2 hover:bg-content3 transition-colors duration-200 border-0 shadow-sm',
                }}
                placeholder={searchPlaceholder}
                radius="lg"
                startContent={
                  <Search className="w-4 h-4 text-foreground-400" />
                }
                variant="flat"
                onValueChange={onSearch}
              />
            )}

            {/* 选择器 */}
            {selects.map((select) => (
              <Select
                key={select.key}
                aria-label={select.label}
                className="w-full sm:w-48"
                classNames={{
                  trigger:
                    'bg-content2 hover:bg-content3 border-0 shadow-sm transition-colors duration-200',
                }}
                placeholder={select.placeholder || select.label}
                radius="lg"
                selectedKeys={select.selectedKey ? [select.selectedKey] : []}
                variant="flat"
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0] as string

                  select.onSelectionChange?.(key)
                }}
              >
                {select.items.map((item) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                ))}
              </Select>
            ))}
          </div>

          {/* 右侧：操作按钮 */}
          <div className="flex flex-wrap gap-3 shrink-0">
            {actions.map((action) => (
              <Button
                key={action.key}
                className="font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
                color={action.color || 'default'}
                radius="lg"
                size={action.size || 'md'}
                startContent={action.icon}
                variant={action.variant || 'flat'}
                onPress={action.onPress}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 自定义内容 */}
        {children && (
          <>
            <Divider className="my-4" />
            {children}
          </>
        )}
      </div>
    </Card>
  )
}

// 预设的常用工具栏配置
export const toolbarPresets = {
  // 仪表盘工具栏
  dashboard: {
    actions: [
      {
        key: 'refresh',
        label: '刷新',
        icon: <RefreshCw className="w-4 h-4" />,
        variant: 'bordered' as const,
      },
      {
        key: 'settings',
        label: '设置',
        icon: <Settings2 className="w-4 h-4" />,
        variant: 'bordered' as const,
      },
    ],
    selects: [
      {
        key: 'timeRange',
        label: '时间范围',
        placeholder: '选择时间范围',
        items: [
          { key: 'today', label: '今天' },
          { key: 'week', label: '本周' },
          { key: 'month', label: '本月' },
          { key: 'year', label: '本年' },
        ],
      },
    ],
  },

  // 存储管理工具栏
  storage: {
    actions: [
      {
        key: 'upload',
        label: '上传',
        icon: <Upload className="w-4 h-4" />,
        color: 'primary' as const,
        variant: 'solid' as const,
      },
      {
        key: 'download',
        label: '下载',
        icon: <Download className="w-4 h-4" />,
        variant: 'bordered' as const,
      },
      {
        key: 'filter',
        label: '筛选',
        icon: <Filter className="w-4 h-4" />,
        variant: 'bordered' as const,
      },
    ],
    selects: [
      {
        key: 'fileType',
        label: '文件类型',
        placeholder: '所有类型',
        items: [
          { key: 'all', label: '所有类型' },
          { key: 'image', label: '图片' },
          { key: 'video', label: '视频' },
          { key: 'audio', label: '音频' },
          { key: 'document', label: '文档' },
        ],
      },
      {
        key: 'sortBy',
        label: '排序方式',
        placeholder: '修改时间',
        items: [
          { key: 'modified', label: '修改时间' },
          { key: 'name', label: '文件名' },
          { key: 'size', label: '文件大小' },
          { key: 'type', label: '文件类型' },
        ],
      },
    ],
  },

  // 设置页面工具栏
  settings: {
    actions: [
      {
        key: 'save',
        label: '保存设置',
        color: 'primary' as const,
        variant: 'solid' as const,
      },
      {
        key: 'reset',
        label: '重置',
        color: 'danger' as const,
        variant: 'bordered' as const,
      },
    ],
  },
}
