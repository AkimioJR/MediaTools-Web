import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal'
import { Button } from '@heroui/button'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

export interface OpenModalOptions {
  title?: string
  size?: ModalSize
  showFooter?: boolean
  confirmText?: string
  cancelText?: string
  hideCloseButton?: boolean
  closeOnOverlayClick?: boolean
}

export interface ModalControls<Result = unknown> {
  close: (result?: Result) => void
}

type ModalRenderer<Result = unknown> = (
  controls: ModalControls<Result>,
) => React.ReactNode

interface ModalContextValue {
  openModal: <Result = unknown>(
    renderer: ModalRenderer<Result>,
    options?: OpenModalOptions,
  ) => Promise<Result | undefined>
  closeModal: (result?: unknown) => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

export function useModal() {
  const ctx = useContext(ModalContext)

  if (!ctx) throw new Error('useModal must be used within ModalProvider')

  return ctx
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [modalState, setModalState] = useState<{
    options: OpenModalOptions
    renderer: ModalRenderer | null
  }>({
    options: {},
    renderer: null,
  })

  const resolverRef = useRef<((value: any) => void) | null>(null)

  const handleModalClose = useCallback((result?: unknown) => {
    const resolver = resolverRef.current

    resolverRef.current = null
    // 延迟清理以确保动画完成
    setTimeout(() => {
      setModalState({ options: {}, renderer: null })
      if (resolver) resolver(result)
    }, 300)
  }, [])

  const openModal = useCallback<ModalContextValue['openModal']>(
    async (renderer, options = {}) => {
      return new Promise((resolve) => {
        resolverRef.current = resolve
        setModalState({
          options,
          renderer,
        })
        onOpen()
      })
    },
    [onOpen],
  )

  const closeModal = useCallback(
    (result?: unknown) => {
      handleModalClose(result)
      onOpenChange()
    },
    [handleModalClose, onOpenChange],
  )

  const controls: ModalControls = {
    close: (result?: unknown) => {
      handleModalClose(result)
      onOpenChange()
    },
  }

  const { options, renderer } = modalState

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal
        backdrop="blur"
        hideCloseButton={options.hideCloseButton}
        isOpen={isOpen}
        size={(options.size as any) || 'lg'}
        onOpenChange={(open) => {
          if (!open) {
            handleModalClose()
          }
          onOpenChange()
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {options.title && <ModalHeader>{options.title}</ModalHeader>}
              <ModalBody className="py-6">
                {renderer ? renderer(controls) : null}
              </ModalBody>
              {options.showFooter && (
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    {options.cancelText || '取消'}
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    {options.confirmText || '确定'}
                  </Button>
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </ModalContext.Provider>
  )
}
