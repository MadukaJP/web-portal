import { API_URL, API_VERSION } from '#/config'
import axios, { AxiosHeaders } from 'axios'

const UNSAFE_METHODS = new Set(['post', 'put', 'patch', 'delete'])

function getBrowserCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined

  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [rawKey, ...rawValue] = cookie.trim().split('=')
    if (rawKey === name) return decodeURIComponent(rawValue.join('='))
  }

  return undefined
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'X-API-Version': API_VERSION },
})

let isRefreshing = false

api.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase()
  const csrfToken =
    method && UNSAFE_METHODS.has(method)
      ? getBrowserCookie('csrf_token')
      : undefined

  if (csrfToken) {
    const headers = AxiosHeaders.from(config.headers)
    headers.set('X-CSRF-Token', csrfToken)
    config.headers = headers
  }

  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      if (typeof window === 'undefined') {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        window.location.href = '/login'
        return Promise.reject(error)
      }

      original._retry = true
      isRefreshing = true

      try {
        await api.post('/auth/refresh')
        isRefreshing = false
        return api(original)
      } catch {
        isRefreshing = false
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)
