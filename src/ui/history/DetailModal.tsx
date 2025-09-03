import type { MediaTransferHistory } from '@/types'
import type { TabItem } from '@/components/custom-tabs'

import React from 'react'

import MediaDetailCard from '@/components/media-detail-card'
import LabelValue from '@/components/LabelValue'

export interface DetailModalProps {
  row: MediaTransferHistory
  onClose: () => void
}

export default function DetailModal({ row }: DetailModalProps) {
  const statusText = row.status ? '成功' : '失败'

  const appendTabs: TabItem[] = [
    {
      key: 'path',
      title: '路径',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabelValue mono className="min-w-0" label="源路径">
            {row.src_path}
          </LabelValue>
          <LabelValue mono className="min-w-0" label="目标路径">
            {row.dst_path}
          </LabelValue>
        </div>
      ),
    },
    {
      key: 'status',
      title: '状态',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LabelValue label="方式">{row.transfer_type}</LabelValue>
          <LabelValue label="状态">
            <StatusBadge success={row.status}>{statusText}</StatusBadge>
          </LabelValue>
          {row.message ? (
            <LabelValue className="md:col-span-2" label="消息">
              <span className="text-foreground-700 break-words leading-relaxed">
                {row.message}
              </span>
            </LabelValue>
          ) : null}
        </div>
      ),
    },
  ]

  return (
    <MediaDetailCard
      tabsScrollable
      appendTabs={appendTabs}
      customRule={undefined}
      item={row.item}
      metaRule={undefined}
    />
  )
}

function StatusBadge({
  success,
  children,
}: {
  success: boolean
  children: React.ReactNode
}) {
  const base = 'inline-flex items-center rounded-small px-2 py-0.5 text-xs'
  const color = success
    ? 'bg-success-100 text-success-600'
    : 'bg-danger-100 text-danger-600'

  return <span className={`${base} ${color}`}>{children}</span>
}
