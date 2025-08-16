import { useState, ReactNode } from 'react'
import { Button } from '@heroui/button'

import { cn } from '@/utils'

export interface TabItem {
  key: string
  title: string
  content: ReactNode
}

export interface CustomTabsProps {
  items: TabItem[]
  defaultActiveKey?: string
  activeKey?: string
  onActiveKeyChange?: (key: string) => void
  className?: string
  tabsClassName?: string
  contentClassName?: string
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
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

export function CustomTabs({
  items,
  defaultActiveKey,
  activeKey: controlledActiveKey,
  onActiveKeyChange,
  className,
  tabsClassName,
  contentClassName,
  variant: _variant = 'light',
  color = 'primary',
  size = 'sm',
  radius = 'md',
}: CustomTabsProps) {
  const [internalActiveKey, setInternalActiveKey] = useState(
    defaultActiveKey || items[0]?.key || '',
  )

  const activeKey = controlledActiveKey ?? internalActiveKey
  const activeItem = items.find((item) => item.key === activeKey)

  const handleTabClick = (key: string) => {
    if (controlledActiveKey === undefined) {
      setInternalActiveKey(key)
    }
    onActiveKeyChange?.(key)
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Headers */}
      <div
        className={cn(
          'flex flex-wrap gap-1 p-1 bg-default-100 rounded-lg',
          tabsClassName,
        )}
      >
        {items.map((item) => {
          const isActive = item.key === activeKey

          return (
            <Button
              key={item.key}
              className={cn(
                'flex-1 min-w-0 transition-all duration-200',
                isActive
                  ? 'bg-background shadow-sm text-foreground font-medium'
                  : 'bg-transparent text-foreground-600 hover:text-foreground hover:bg-default-200',
              )}
              color={isActive ? color : 'default'}
              radius={radius}
              size={size}
              variant={isActive ? 'solid' : 'light'}
              onPress={() => handleTabClick(item.key)}
            >
              {item.title}
            </Button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className={cn('mt-4', contentClassName)}>{activeItem?.content}</div>
    </div>
  )
}
