import type { FileInfo, StorageProviderInterface } from '@/types/storage'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { useState } from 'react'

interface FileOperationDialogsProps {
  // 复制对话框
  showCopyDialog: boolean
  onCloseCopyDialog: () => void
  onConfirmCopy: (destProvider: string, destPath: string) => void

  // 移动对话框
  showMoveDialog: boolean
  onCloseMoveDialog: () => void
  onConfirmMove: (destProvider: string, destPath: string) => void

  // 重命名对话框
  showRenameDialog: boolean
  onCloseRenameDialog: () => void
  onConfirmRename: (newName: string) => void

  // 当前选中的文件
  selectedFile: FileInfo | null

  // 存储提供者列表
  providers: StorageProviderInterface[]

  // 当前存储器
  currentProvider: string

  // 当前路径
  currentPath: string
}

export default function FileOperationDialogs({
  showCopyDialog,
  onCloseCopyDialog,
  onConfirmCopy,
  showMoveDialog,
  onCloseMoveDialog,
  onConfirmMove,
  showRenameDialog,
  onCloseRenameDialog,
  onConfirmRename,
  selectedFile,
  providers,
  currentProvider,
  currentPath,
}: FileOperationDialogsProps) {
  const [copyDestProvider, setCopyDestProvider] = useState(currentProvider)
  const [copyDestPath, setCopyDestPath] = useState(currentPath)
  const [moveDestProvider, setMoveDestProvider] = useState(currentProvider)
  const [moveDestPath, setMoveDestPath] = useState(currentPath)
  const [newFileName, setNewFileName] = useState('')

  // 处理复制确认
  const handleCopyConfirm = () => {
    onConfirmCopy(copyDestProvider, copyDestPath)
  }

  // 处理移动确认
  const handleMoveConfirm = () => {
    onConfirmMove(moveDestProvider, moveDestPath)
  }

  // 处理重命名确认
  const handleRenameConfirm = () => {
    if (newFileName.trim()) {
      onConfirmRename(newFileName.trim())
    }
  }

  return (
    <>
      {/* 复制文件对话框 */}
      <Modal isOpen={showCopyDialog} onClose={onCloseCopyDialog}>
        <ModalContent>
          <ModalHeader>
            <h3>复制文件</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-sm text-foreground-600">
                复制 &quot;{selectedFile?.name}&quot; 到:
              </p>

              <Select
                label="目标存储器"
                selectedKeys={[copyDestProvider]}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0] as string

                  setCopyDestProvider(key)
                }}
              >
                {providers.map((provider) => (
                  <SelectItem key={provider.storage_type}>
                    {provider.storage_type}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="目标路径"
                placeholder="请输入目标路径"
                value={copyDestPath}
                onValueChange={setCopyDestPath}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCloseCopyDialog}>
              取消
            </Button>
            <Button color="primary" onPress={handleCopyConfirm}>
              确认复制
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 移动文件对话框 */}
      <Modal isOpen={showMoveDialog} onClose={onCloseMoveDialog}>
        <ModalContent>
          <ModalHeader>
            <h3>移动文件</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-sm text-foreground-600">
                移动 &quot;{selectedFile?.name}&quot; 到:
              </p>

              <Select
                label="目标存储器"
                selectedKeys={[moveDestProvider]}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0] as string

                  setMoveDestProvider(key)
                }}
              >
                {providers.map((provider) => (
                  <SelectItem key={provider.storage_type}>
                    {provider.storage_type}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label="目标路径"
                placeholder="请输入目标路径"
                value={moveDestPath}
                onValueChange={setMoveDestPath}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCloseMoveDialog}>
              取消
            </Button>
            <Button color="warning" onPress={handleMoveConfirm}>
              确认移动
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 重命名文件对话框 */}
      <Modal isOpen={showRenameDialog} onClose={onCloseRenameDialog}>
        <ModalContent>
          <ModalHeader>
            <h3>重命名</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-sm text-foreground-600">
                重命名 &quot;{selectedFile?.name}&quot;:
              </p>

              <Input
                defaultValue={selectedFile?.name || ''}
                label="新名称"
                placeholder="请输入新的文件名"
                value={newFileName}
                onValueChange={setNewFileName}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCloseRenameDialog}>
              取消
            </Button>
            <Button color="primary" onPress={handleRenameConfirm}>
              确认重命名
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
