import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Spinner } from '@heroui/spinner'
import { LucideIcon, Save } from 'lucide-react'
import { ReactNode } from 'react'

import { ButtonIcon } from '@/components/icon'

interface BaseSettingsCardProps {
  title: string
  icon: LucideIcon
  loading?: boolean
  onSave?: () => void
  children: ReactNode
  className?: string
}

export function BaseSettingsCard({
  title,
  icon: Icon,
  loading = false,
  onSave,
  children,
  className = '',
}: BaseSettingsCardProps) {
  return (
    <Card className={className} radius="lg" shadow="sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
        </div>
      </CardHeader>
      <CardBody className="pt-0 space-y-4">
        {children}
        {onSave && (
          <div className="flex justify-end">
            <Button
              color="primary"
              isLoading={loading}
              startContent={<ButtonIcon icon={Save} />}
              variant="shadow"
              onPress={onSave}
            >
              {loading ? '保存中...' : '保存'}
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

// 通用加载状态组件
export function LoadingSpinner({
  label = '加载配置中...',
}: {
  label?: string
}) {
  return (
    <div className="flex justify-center items-center p-8">
      <Spinner label={label} />
    </div>
  )
}

// 通用错误状态组件
export function ErrorMessage({
  message = '无法加载配置',
}: {
  message?: string
}) {
  return (
    <div className="p-3 sm:p-4">
      <p className="text-center text-foreground-500">{message}</p>
    </div>
  )
}
