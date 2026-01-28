import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";


const AXIOS: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_API_URL,
    timeout: 50000,
    headers:{
        "Content-Type" : "application/json"
    }
})

class HttpClient {
  async get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return AXIOS.get<T>(url, { params, ...config });
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return AXIOS.post<T>(url, data, { params, ...config });
  }

}

export default new HttpClient();