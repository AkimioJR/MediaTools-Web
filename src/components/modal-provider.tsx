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

interface ModalState<Result = unknown> {
  isOpen: boolean
  options: OpenModalOptions
  renderer: ModalRenderer<Result> | null
}

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
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    options: {},
    renderer: null,
  })

  const resolverRef = useRef<((value: any) => void) | null>(null)

  const doClose = useCallback((result?: unknown) => {
    setModalState((prev) => ({ ...prev, isOpen: false }))
    const resolver = resolverRef.current

    resolverRef.current = null
    if (resolver) resolver(result)
    // 延迟清理内容以便关闭动画
    setTimeout(() => {
      setModalState({ isOpen: false, options: {}, renderer: null })
    }, 150)
  }, [])

  const openModal = useCallback<ModalContextValue['openModal']>(
    async (renderer, options = {}) => {
      return new Promise((resolve) => {
        resolverRef.current = resolve
        setModalState({ isOpen: true, options, renderer })
      })
    },
    [],
  )

  const closeModal = useCallback(
    (result?: unknown) => doClose(result),
    [doClose],
  )

  const controls: ModalControls = {
    close: (result?: unknown) => doClose(result),
  }

  const { isOpen, options, renderer } = modalState

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal
        backdrop="blur"
        hideCloseButton={options.hideCloseButton}
        isOpen={isOpen}
        size={(options.size as any) || 'lg'}
        onClose={() =>
          options.closeOnOverlayClick === false ? undefined : doClose()
        }
      >
        <ModalContent>
          {(onClose) => (
            <>
              {options.title && <ModalHeader>{options.title}</ModalHeader>}
              <ModalBody>{renderer ? renderer(controls) : null}</ModalBody>
              {options.showFooter && (
                <ModalFooter>
                  <Button
                    variant="light"
                    onPress={() => {
                      onClose()
                      doClose(undefined)
                    }}
                  >
                    {options.cancelText || '取消'}
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      onClose()
                      doClose(true)
                    }}
                  >
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
