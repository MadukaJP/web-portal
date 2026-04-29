import { deleteProfile } from '#/functions/profiles'
import { keys } from '#/lib/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteProfile(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: keys.profile(id) })
      queryClient.invalidateQueries({ queryKey: keys.profiles() })
    },
  })
}
