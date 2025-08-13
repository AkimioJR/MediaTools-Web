import axios from "axios";

export interface ErrResponse {
  success: boolean;
  message: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
});

// 响应拦截器 - 统一处理后端响应格式
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 网络错误或其他错误
    const message =
      error.response?.data?.message || error.message || "网络错误";
    throw new Error(message);
  }
);

export default api;
