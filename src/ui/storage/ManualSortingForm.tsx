import type { StorageFileInfo } from '@/types/storage'

import { Form } from '@heroui/form'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { Select, SelectItem } from '@heroui/select'
import { Switch } from '@heroui/switch'
import { Plus } from 'lucide-react'

import { ButtonIcon } from '@/components/icon'

const targetStorageOptions = [
  {
    label: '本地',
    value: 'local',
  },

  {
    label: '网络',
    value: 'network',
  },
]

const sortModeOptions = [
  {
    label: '按日期',
    value: 'date',
  },
  {
    label: '按类型',
    value: 'type',
  },
]

const fileTypeOptions = [
  {
    label: '图片',
    value: 'image',
  },
  {
    label: '视频',
    value: 'video',
  },
  {
    label: '音频',
  },
]

export const ManualSortingForm = (_params: { file: StorageFileInfo }) => {
  return (
    <Form className="grid grid-cols-2 gap-4">
      <Select label="目的存储">
        {targetStorageOptions.map((option) => (
          <SelectItem key={option.value}>{option.label}</SelectItem>
        ))}
      </Select>
      <Select label="整理方式">
        {sortModeOptions.map((option) => (
          <SelectItem key={option.value}>{option.label}</SelectItem>
        ))}
      </Select>
      <Input
        className="col-span-2"
        description="整理的目的地路径，留空将自动匹配"
        label="目的地路径"
      />
      <Select description="文件的媒体类型" label="类型">
        {fileTypeOptions.map((option) => (
          <SelectItem key={option.value}>{option.label}</SelectItem>
        ))}
      </Select>
      <Input
        description="按名称查询媒体编号，留空自动识别"
        label="TheMovieDb编号"
      />

      {true && (
        <>
          <Input
            className="col-span-1"
            description="指定剧集组"
            label="剧集组编号"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select description="第几季" label="季">
              <SelectItem key="1">1</SelectItem>
            </Select>
            <Select description="第几集" label="集">
              <SelectItem key="1">1</SelectItem>
            </Select>
          </div>
          <Input
            description="使用定位文件名中的集数部分以辅助识别"
            label="集数定位"
          />
          <Input description="集数偏移运算，如-10或EP*2" label="集数偏移" />
        </>
      )}

      <Input description="指定Part，如part1" label="指定Part" />
      <Input description="只整理大于最小文件大小的文件" label="最小文件大小" />
      <Switch>
        <div className="flex flex-col gap-1">
          <p className="text-foreground-500">刮削元数据</p>
          <p className="text-foreground-500 text-tiny">
            整理完成后自动刮削元数据
          </p>
        </div>
      </Switch>
      <Switch>
        <div className="flex flex-col gap-1">
          <p className="text-foreground-500">刮削元数据</p>
          <p className="text-foreground-500 text-tiny">
            整理完成后自动刮削元数据
          </p>
        </div>
      </Switch>
      <div className="col-span-2 flex justify-end gap-4">
        <Button
          color="success"
          startContent={<ButtonIcon icon={Plus} />}
          variant="shadow"
        >
          加入整理队列
        </Button>
      </div>
    </Form>
  )
}
