import { api } from '#/lib/api'

export type MeResponse = {
  id: number | string
  username: string
  email: string
  avatar_url: string
  role: string
}

export async function getMe(): Promise<MeResponse> {
  const res = await api.get('/auth/me')
  return res.data.data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}

export async function createApiKey(): Promise<string> {
  const res = await api.post('/auth/api-keys')
  return res.data.api_key || res.data.data?.api_key
}
