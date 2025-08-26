import type { StorageFileInfo } from '@/types/storage'

import { Button } from '@heroui/button'
import {
  Download,
  Copy,
  Move,
  Trash2,
  ScanSearch,
  FolderSymlink,
} from 'lucide-react'
import React, { useMemo } from 'react'

import { cn } from '@/utils'

interface ActionParamsType {
  file: StorageFileInfo
  onRecognize: (file: StorageFileInfo) => void
  onDownload: (file: StorageFileInfo) => void
  onCopy: (file: StorageFileInfo) => void
  onMove: (file: StorageFileInfo) => void
  onDelete: (file: StorageFileInfo) => void
  onManualSort: (file: StorageFileInfo) => void
}

export const FileActions = React.memo(function FileActions({
  file,
  onRecognize,
  onDownload,
  onCopy,
  onMove,
  onDelete,
  onManualSort,
}: ActionParamsType) {
  const iconCss = 'w-3 h-3 sm:w-4 sm:h-4'

  const Actions = useMemo(
    () => [
      {
        label: '下载',
        icon: <Download className={iconCss} />,
        onClick: () => onDownload(file),
      },
      {
        label: '手动整理',
        icon: <FolderSymlink className={iconCss} />,
        onClick: () => onManualSort(file),
      },
      {
        label: '识别媒体',
        icon: <ScanSearch className={iconCss} />,
        onClick: () => onRecognize(file),
      },
      {
        label: '复制',
        icon: <Copy className={iconCss} />,
        onClick: () => onCopy(file),
      },

      {
        label: '移动',
        icon: <Move className={iconCss} />,
        onClick: () => onMove(file),
      },

      {
        label: '删除',
        icon: <Trash2 className={cn(iconCss, 'text-danger')} />,
        onClick: () => onDelete(file),
      },
    ],
    [],
  )

  return (
    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 ease ">
      {Actions.map((action) => {
        if (file.type === 'Directory' && action.label === '下载') {
          return null
        } else if (file.type !== 'File' && action.label === '识别媒体') {
          return null
        }

        return (
          <Button
            key={action.label}
            isIconOnly
            aria-label={action.label}
            size="sm"
            variant="light"
            onMouseDown={(e) => e.stopPropagation()}
            onPress={action.onClick}
          >
            {action.icon}
          </Button>
        )
      })}
    </div>
  )
})
