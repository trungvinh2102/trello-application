import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/configs';
import { ErrorHandler } from '@/utils/errorHandler';
import { useAuthStore } from '@/stores';

export const createApiClient = (): AxiosInstance => {
  const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS,
    withCredentials: true,
  });

  api.interceptors.response.use(
    (response) => {
      return response.data;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/refresh')
      ) {
        originalRequest._retry = true;

        try {
          await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {}, { withCredentials: true });

          return api(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().clearAuth();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      ErrorHandler.handle(error);
      return Promise.reject(error);
    }
  );

  return api;
};

export const apiClient = createApiClient();
