import type { Task } from '@/types'

import api from './api'

export const TaskService = {
  TransferTaskService: {
    async GetAllTasks(): Promise<Task[]> {
      return await api.get('/task/transfer')
    },
    async GetTask(task_id: string): Promise<Task> {
      return await api.get(`/task/transfer/${task_id}`)
    },
    async CancelTask(task_id: string): Promise<Task> {
      return await api.delete(`/task/transfer/${task_id}`)
    },
  },
}
