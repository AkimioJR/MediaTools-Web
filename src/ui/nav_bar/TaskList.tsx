import type { Task } from '@/types'

import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@heroui/button'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown'
import { ListVideo } from 'lucide-react'

import { HeaderIcon } from '@/components/icon'
import { TaskService } from '@/services/task'
import { handleApiError } from '@/utils/message'
import { showSuccess } from '@/utils/message'

export const TaskList: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const pollingTimerRef = useRef<number | null>(null)

  const startPolling = useCallback(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        const data = await TaskService.TransferTaskService.GetAllTasks()

        setTasks(Array.isArray(data) ? data : [])
      } catch (error) {
        handleApiError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()

    if (pollingTimerRef.current) window.clearInterval(pollingTimerRef.current)
    pollingTimerRef.current = window.setInterval(fetchTasks, 3000)
  }, [])

  const stopPolling = useCallback(() => {
    if (pollingTimerRef.current) {
      window.clearInterval(pollingTimerRef.current)
      pollingTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      startPolling()
    } else {
      stopPolling()
    }

    return () => {
      stopPolling()
    }
  }, [isOpen, startPolling, stopPolling])

  const handleCancel = useCallback(async (taskId: string) => {
    try {
      await TaskService.TransferTaskService.CancelTask(taskId)
      showSuccess('取消任务成功')

      setTasks((prev) => prev.filter((t) => t.id !== taskId))
    } catch (error) {
      handleApiError('取消任务失败:' + error)
    }
  }, [])

  return (
    <Dropdown className="" isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger>
        <Button isIconOnly aria-label="转移任务列表" size="sm" variant="light">
          <HeaderIcon icon={ListVideo} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="转移任务列表"
        emptyContent={isLoading ? '加载中…' : '暂无进行中的任务'}
        items={tasks}
      >
        {(task: Task) => (
          <DropdownItem
            key={task.id}
            description={`状态：${task.state}`}
            endContent={
              <Button
                color="danger"
                size="sm"
                variant="flat"
                onPress={() => handleCancel(task.id)}
              >
                取消
              </Button>
            }
          >
            {task.name}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}
