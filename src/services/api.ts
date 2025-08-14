import type { AxiosError, AxiosResponse } from 'axios'

import axios from 'axios'

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
})

// 响应拦截器 - 统一处理后端响应格式
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // 如果响应类型是 blob，直接返回
    if (response.config.responseType === 'blob') {
      return response.data
    }

    const data = response.data as ApiResponse<unknown>

    // 如果后端返回 success: false，抛出错误

    if (response.status !== 200 || !data.success) {
      throw new Error(data.message || '请求失败')
    }

    return data.data
  },
  (error: AxiosError<{ message?: string }>) => {
    // 网络错误或其他错误
    const message = error.response?.data?.message || error.message || '网络错误'

    throw new Error(message)
  },
)

export default api
