import axios from 'axios';
import type { SlideEvent } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const get  = <T>(url: string)                 => api.get<T>(url).then(r => r.data);
export const post = <T>(url: string, data?: unknown) => api.post<T>(url, data).then(r => r.data);
export const put  = <T>(url: string, data?: unknown) => api.put<T>(url, data).then(r => r.data);
export const del  = <T>(url: string)                 => api.delete<T>(url).then(r => r.data);

// Slide endpoints
export const getSlides = () => get('/slides');

// ─────────────────────────────────────────────────────────────────────────────
// API INTEGRATION: When backend is ready, this is already wired up.
// The token is auto-attached by the interceptor above.
// Just uncomment the import in SlideDetailPage.tsx to use it.
// ─────────────────────────────────────────────────────────────────────────────

export const getSlideEvents = (slideId: string) =>
  api.get<{ events: SlideEvent[] }>(`/slides/${slideId}/events`).then(r => r.data);

export default api;