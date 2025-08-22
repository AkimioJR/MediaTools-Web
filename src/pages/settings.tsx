import { Card } from '@heroui/card'
import { Tabs, Tab } from '@heroui/tabs'
import { FileText, Image, Video } from 'lucide-react'
import { useState } from 'react'

import { LogSettings, ScrapeSettings, MediaSettings } from '@/ui/settings'

const SETTINGS_TABS = [
  {
    key: 'log',
    icon: FileText,
    labelFull: '日志配置',
    labelShort: '日志',
    component: LogSettings,
  },
  {
    key: 'scrape',
    icon: Image,
    labelFull: '刮削配置',
    labelShort: '刮削',
    component: ScrapeSettings,
  },
  {
    key: 'media',
    icon: Video,
    labelFull: '媒体库配置',
    labelShort: '媒体',
    component: MediaSettings,
  },
] as const

type TabKey = (typeof SETTINGS_TABS)[number]['key']

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState<TabKey>('log')

  const currentTab = SETTINGS_TABS.find((tab) => tab.key === selectedTab)
  const CurrentComponent = currentTab?.component

  return (
    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
      {/* 标签页工具栏 */}
      <Card radius="lg" shadow="sm">
        <div className="p-3 sm:p-4">
          <Tabs
            aria-label="设置选项"
            classNames={{ tabList: 'gap-2', tab: 'text-sm' }}
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as TabKey)}
          >
            {SETTINGS_TABS.map(({ key, icon: Icon, labelFull, labelShort }) => (
              <Tab
                key={key}
                title={
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{labelFull}</span>
                    <span className="sm:hidden">{labelShort}</span>
                  </div>
                }
              />
            ))}
          </Tabs>
        </div>
      </Card>

      {/* 动态渲染当前选中的设置组件 */}
      {CurrentComponent && <CurrentComponent />}
    </div>
  )
}
