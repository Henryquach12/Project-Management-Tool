import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL ?? ''
const api = axios.create({ baseURL: `${BASE}/api` })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  register: (data: { username: string; email: string; password: string; displayName?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/users/me'),
}

export const usersApi = {
  search: (q: string) => api.get('/users/search', { params: { q } }),
}

export const projectsApi = {
  list: () => api.get('/projects'),
  get: (id: number) => api.get(`/projects/${id}`),
  create: (data: { name: string; description?: string }) => api.post('/projects', data),
  update: (id: number, data: { name: string; description?: string }) => api.put(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
  addMember: (projectId: number, data: { userId: number; role: string; reportsToUserId?: number }) =>
    api.post(`/projects/${projectId}/members`, data),
  removeMember: (projectId: number, userId: number) =>
    api.delete(`/projects/${projectId}/members/${userId}`),
}

export const tasksApi = {
  list: (projectId: number) => api.get(`/projects/${projectId}/tasks`),
  myTasks: () => api.get('/tasks/my'),
  create: (projectId: number, data: object) => api.post(`/projects/${projectId}/tasks`, data),
  update: (projectId: number, taskId: number, data: object) =>
    api.put(`/projects/${projectId}/tasks/${taskId}`, data),
  updateStatus: (projectId: number, taskId: number, status: string) =>
    api.patch(`/projects/${projectId}/tasks/${taskId}/status`, null, { params: { status } }),
  delete: (projectId: number, taskId: number) =>
    api.delete(`/projects/${projectId}/tasks/${taskId}`),
}

export default api
