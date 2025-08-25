export type TaskState = 'Pending' | 'Running' | 'Canceling'

export interface Task {
  id: string
  name: string
  state: TaskState
}
