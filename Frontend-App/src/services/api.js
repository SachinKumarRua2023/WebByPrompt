import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:8000/api'; // Update with your backend URL

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token, logout user
          await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        await AsyncStorage.setItem('access_token', access);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/token/', credentials),
  register: (data) => api.post('/auth/register/', data),
  getMe: () => api.get('/auth/me/'),
};

// Prompts API
export const promptsAPI = {
  getAll: (params = {}) => api.get('/prompts/', { params }),
  getById: (id) => api.get(`/prompts/${id}/`),
  create: (data) => api.post('/prompts/', data),
  update: (id, data) => api.patch(`/prompts/${id}/`, data),
  delete: (id) => api.delete(`/prompts/${id}/`),
  toggleFavorite: (id) => api.post(`/prompts/${id}/toggle-favorite/`),
};

export default api;
