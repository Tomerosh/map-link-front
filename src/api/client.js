import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const detail = error.response?.data?.detail
    const message = detail ?? 'Request failed'
    const err = new Error(typeof message === 'string' ? message : JSON.stringify(message))
    err.status = error.response?.status
    return Promise.reject(err)
  },
)

export default api
