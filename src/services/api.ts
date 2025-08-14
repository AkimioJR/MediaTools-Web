import axios from "axios";

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
}
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
});

// 响应拦截器 - 统一处理后端响应格式
api.interceptors.response.use(
  (response) => {
    if (response.config.responseType === "blob") {
      // 如果响应类型是 blob，直接返回
      return response.data;
    }

    const data = response.data as Response<any>;
    if (!data.success) {
      // 如果响应不成功，抛出错误
      throw new Error(data.message || "请求失败");
    }

    return data.data; // 返回实际数据
  },
  (error) => {
    // 网络错误或其他错误
    const message =
      error.response?.data?.message || error.message || "网络错误";
    throw new Error(message);
  }
);

export default api;
