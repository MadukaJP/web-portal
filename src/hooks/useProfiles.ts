import { getProfiles } from '#/functions/profiles'
import { keys } from '#/lib/query-keys'
import { useQuery } from '@tanstack/react-query'

export interface Filters extends Record<string, string | number | undefined> {
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

export function useProfiles(filters: Filters = {}) {
  return useQuery({
    queryKey: keys.profiles(filters),
    queryFn: () => getProfiles(filters),
    placeholderData: (prev) => prev,
  })
}
