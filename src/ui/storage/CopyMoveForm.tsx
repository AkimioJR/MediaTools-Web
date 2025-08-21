import type { StorageProviderInterface } from '@/types/storage'

import { useState } from 'react'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Button } from '@heroui/button'

export function CopyMoveForm({
  providers,
  defaultProvider,
  defaultPath,
  onSubmit,
  onCancel,
}: {
  providers: StorageProviderInterface[]
  defaultProvider: string
  defaultPath: string
  onSubmit: (provider: string, path: string) => void
  onCancel: () => void
}) {
  const [provider, setProvider] = useState(defaultProvider)
  const [path, setPath] = useState(defaultPath)

  return (
    <div className="space-y-4">
      <Select
        aria-label="目标存储器"
        label="目标存储器"
        selectedKeys={provider ? [provider] : []}
        onSelectionChange={(keys) => setProvider(Array.from(keys)[0] as string)}
      >
        {providers.map((p) => (
          <SelectItem key={p.storage_type}>{p.storage_type}</SelectItem>
        ))}
      </Select>
      <Input
        label="目标路径"
        placeholder="请输入目标路径"
        value={path}
        onValueChange={setPath}
      />
      <div className="flex justify-end gap-2">
        <Button variant="shadow" onPress={onCancel}>
          取消
        </Button>
        <Button
          color="primary"
          variant="shadow"
          onPress={() => onSubmit(provider, path)}
        >
          确认
        </Button>
      </div>
    </div>
  )
}
