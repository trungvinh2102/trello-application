import axios from 'axios';
import { API_CONFIG } from '@/configs';

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
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, {}, { withCredentials: true });

        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    const errorMessage =
      (error.response?.data as { error?: string })?.error || error.message || 'An error occurred';
    console.error('API Error:', errorMessage);

    return Promise.reject(error);
  }
);

export default api;
