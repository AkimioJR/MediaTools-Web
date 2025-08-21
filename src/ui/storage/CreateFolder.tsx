import { Input } from '@heroui/input'
import { useState } from 'react'
import { Button } from '@heroui/button'

export const CreateFolder = ({
  onSubmit,
}: {
  onSubmit: (name: string) => void
}) => {
  const [name, setName] = useState('')

  return (
    <div className="flex items-center gap-4">
      <Input
        placeholder="请输入文件夹名称"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSubmit(name)
          }
        }}
      />
      <Button
        color="primary"
        isDisabled={!name}
        variant="shadow"
        onPress={() => onSubmit(name)}
      >
        确定
      </Button>
    </div>
  )
}
