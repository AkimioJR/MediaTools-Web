import type { AxiosError, AxiosResponse } from 'axios'

import axios from 'axios'

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL,
  timeout: 1000 * 20,
})

api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.responseType === 'blob') {
      return response.data
    }

    const data = response.data as ApiResponse<unknown>

    if (response.status !== 200 || !data.success) {
      throw new Error(data.message || '请求失败')
    }

    return data.data
  },
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message || error.message || '网络错误'

    throw new Error(message)
  },
)

export default api
