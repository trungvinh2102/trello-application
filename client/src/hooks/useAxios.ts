import { useCallback } from 'react';
import { apiClient } from '@/utils/apiClient';
import { AxiosRequestConfig } from 'axios';

interface UseAxiosReturn {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) => Promise<T>;
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => Promise<T>;
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => Promise<T>;
  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => Promise<T>;
  del: <T = unknown>(url: string, config?: AxiosRequestConfig) => Promise<T>;
}

export function useAxios(): UseAxiosReturn {
  const get = useCallback(<T = unknown>(url: string, config?: AxiosRequestConfig) => {
    return apiClient.get<T, T>(url, config);
  }, []);

  const post = useCallback(
    <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
      return apiClient.post<T, T>(url, data, config);
    },
    []
  );

  const put = useCallback(
    <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
      return apiClient.put<T, T>(url, data, config);
    },
    []
  );

  const patch = useCallback(
    <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
      return apiClient.patch<T, T>(url, data, config);
    },
    []
  );

  const del = useCallback(<T = unknown>(url: string, config?: AxiosRequestConfig) => {
    return apiClient.delete<T, T>(url, config);
  }, []);

  return {
    get,
    post,
    put,
    patch,
    del,
  };
}
