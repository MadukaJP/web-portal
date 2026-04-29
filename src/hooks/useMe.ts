import { getMe } from '#/functions/auth'
import { keys } from '#/lib/query-keys'
import { useQuery } from '@tanstack/react-query'

export function useMe() {
  return useQuery({
    queryKey: keys.me(),
    queryFn: getMe,
    staleTime: 1000 * 60 * 2,
    retry: false,
  })
}
