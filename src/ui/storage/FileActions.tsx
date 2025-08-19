import type { StorageFileInfo } from '@/types/storage'

import { Button } from '@heroui/button'
import { Download, Copy, Move, Trash2, ScanSearch } from 'lucide-react'
import React from 'react'

import { cn } from '@/utils'

export const FileActions = React.memo(function FileActions({
  file,
  onRecognize,
  onDownload,
  onCopy,
  onMove,
  onDelete,
}: {
  file: StorageFileInfo
  onRecognize: (file: StorageFileInfo) => void
  onDownload: (file: StorageFileInfo) => void
  onCopy: (file: StorageFileInfo) => void
  onMove: (file: StorageFileInfo) => void
  onDelete: (file: StorageFileInfo) => void
}) {
  const iconCss = 'w-3 h-3 sm:w-4 sm:h-4'

  return (
    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 ease ">
      <Button
        isIconOnly
        aria-label="识别媒体"
        size="sm"
        variant="light"
        onMouseDown={(e) => e.stopPropagation()}
        onPress={() => onRecognize(file)}
      >
        <ScanSearch className={iconCss} />
      </Button>
      {file.type !== 'Directory' && (
        <Button
          isIconOnly
          aria-label="下载"
          size="sm"
          variant="light"
          onMouseDown={(e) => e.stopPropagation()}
          onPress={() => onDownload(file)}
        >
          <Download className={iconCss} />
        </Button>
      )}
      <Button
        isIconOnly
        aria-label="复制"
        size="sm"
        variant="light"
        onMouseDown={(e) => e.stopPropagation()}
        onPress={() => onCopy(file)}
      >
        <Copy className={iconCss} />
      </Button>
      <Button
        isIconOnly
        aria-label="移动"
        size="sm"
        variant="light"
        onMouseDown={(e) => e.stopPropagation()}
        onPress={() => onMove(file)}
      >
        <Move className={iconCss} />
      </Button>
      <Button
        isIconOnly
        aria-label="删除"
        size="sm"
        variant="light"
        onMouseDown={(e) => e.stopPropagation()}
        onPress={() => onDelete(file)}
      >
        <Trash2 className={cn(iconCss, 'text-danger')} />
      </Button>
    </div>
  )
})
