import { useCallback } from 'react'
import { Button } from '@heroui/button'

import { useModal } from '@/components/modal-provider'

interface ConfirmModalProps {
  title: string
  onConfirm?: () => void
  onCancel?: () => void
}

export const useConfirmModal = () => {
  const { openModal } = useModal()

  const open = useCallback(
    ({ title, onConfirm, onCancel }: ConfirmModalProps) => {
      return openModal(
        (onClose) => (
          <ConfirmContent
            onCancel={() => {
              onCancel?.()
              onClose()
            }}
            onConfirm={() => {
              onConfirm?.()
              onClose()
            }}
          />
        ),
        {
          title,
          hideCloseButton: true,
        },
      )
    },
    [],
  )

  return {
    open,
  }
}

const ConfirmContent = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void
  onCancel: () => void
}) => {
  return (
    <div className="flex gap-4 justify-end items-center">
      <Button variant="shadow" onPress={onCancel}>
        取消
      </Button>
      <Button color="primary" variant="shadow" onPress={onConfirm}>
        确定
      </Button>
    </div>
  )
}
