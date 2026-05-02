import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          // No refresh token, logout user
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user')
          window.location.href = '/login'
          return Promise.reject(error)
        }

        // Try to refresh token
        const response = await axios.post(`${API_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        })

        const { access } = response.data
        localStorage.setItem('access_token', access)

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/token/', credentials),
  register: (data) => api.post('/auth/register/', data),
  getMe: () => api.get('/auth/me/'),
  updateProfile: (data) => api.patch('/auth/me/update/', data),
}

// Prompts API
export const promptsAPI = {
  getAll: (params = {}) => api.get('/prompts/', { params }),
  getById: (id) => api.get(`/prompts/${id}/`),
  create: (data) => api.post('/prompts/', data),
  update: (id, data) => api.patch(`/prompts/${id}/`, data),
  delete: (id) => api.delete(`/prompts/${id}/`),
  toggleFavorite: (id) => api.post(`/prompts/${id}/toggle-favorite/`),
  regenerate: (id) => api.post(`/prompts/${id}/regenerate/`),
  getMyPrompts: (params = {}) => api.get('/prompts/my-prompts/', { params }),
  getFavorites: () => api.get('/prompts/favorites/'),
  getPublic: (params = {}) => api.get('/prompts/public/', { params }),
  getCategories: () => api.get('/prompts/categories/'),
}

// Home API
export const homeAPI = {
  getHealth: () => api.get('/health/'),
  getLanding: () => api.get('/landing/'),
}

export default api
