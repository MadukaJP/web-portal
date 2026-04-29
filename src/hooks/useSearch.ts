import { searchProfiles } from '#/functions/profiles'
import { keys } from '#/lib/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useSearch(q: string, page = 1) {
  return useQuery({
    queryKey: keys.search(q, page),
    queryFn: () => searchProfiles({ q, page }),
    enabled: q.trim().length > 0,
  })
}
