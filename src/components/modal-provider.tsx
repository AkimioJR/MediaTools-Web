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
  useDisclosure,
} from '@heroui/modal'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

export interface OpenModalOptions {
  title?: string
  subtitle?: string
  size?: ModalSize
  confirmText?: string
  cancelText?: string
  hideCloseButton?: boolean
  closeOnOverlayClick?: boolean
}

type ModalRenderer<Result = unknown> = (
  onClose: (result?: Result) => void,
) => React.ReactNode

interface ModalContextValue {
  openModal: <Result = unknown>(
    renderer: ModalRenderer<Result>,
    options?: OpenModalOptions,
  ) => Promise<Result | undefined>
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
    options: {
      hideCloseButton: false,
    },
    renderer: null,
  })

  const resolverRef = useRef<((value: any) => void) | null>(null)

  const closeModal = useCallback(
    (result?: unknown) => {
      const resolver = resolverRef.current

      resolverRef.current = null
      setTimeout(() => {
        setModalState({
          options: {
            hideCloseButton: false,
          },
          renderer: null,
        })
      }, 200)

      if (resolver) resolver(result)
      onOpenChange()
    },
    [onOpenChange],
  )

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

  const { options, renderer } = modalState

  return (
    <ModalContext.Provider value={{ openModal }}>
      {children}
      <Modal
        backdrop="blur"
        hideCloseButton={options.hideCloseButton}
        isOpen={isOpen}
        size={(options.size as any) || 'lg'}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {options.title && (
              <p className="text-lg font-bold">{options.title}</p>
            )}
            {options.subtitle && (
              <p className="text-sm text-foreground-500 font-medium">
                {options.subtitle}
              </p>
            )}
          </ModalHeader>
          <ModalBody className="pb-4 px-3 pt-0 sm:pb-6 sm:px-6">
            {renderer ? renderer(closeModal) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </ModalContext.Provider>
  )
}
