import { api } from '#/lib/api'

export type ProfilesListResponse = {
  status: string
  page: number
  limit: number
  total: number
  total_pages: number
  links: {
    self: string
    next: string | null
    prev: string | null
  }
  data: Profile[]
}

export type Profile = {
  id: string
  name: string
  gender: string
  gender_probability: number
  age: number
  age_group: string
  country_id: string
  country_name: string
  country_probability: number
  created_at: string
}

type ProfileFilters = {
  page?: number
  limit?: number
  gender?: string
  country_id?: string
  age_group?: string
  min_age?: number
  max_age?: number
  sort_by?: string
  order?: string
}

type SearchPayload = {
  q: string
  page?: number
  limit?: number
}

export async function getProfiles(
  filters: ProfileFilters,
): Promise<ProfilesListResponse> {
  const res = await api.get('/api/profiles', { params: filters })
  return res.data
}

export async function getProfile(id: string): Promise<Profile> {
  const res = await api.get(`/api/profiles/${id}`)
  return res.data.data
}

export async function searchProfiles(
  payload: SearchPayload,
): Promise<ProfilesListResponse> {
  const res = await api.get('/api/profiles/search', { params: payload })
  return res.data
}

export async function createProfile(name: string): Promise<Profile> {
  const res = await api.post('/api/profiles', { name })
  return res.data.data
}

export async function deleteProfile(id: string): Promise<void> {
  await api.delete(`/api/profiles/${id}`)
}
