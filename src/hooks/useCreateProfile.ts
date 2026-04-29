import { createProfile } from '#/functions/profiles'
import { keys } from '#/lib/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => createProfile(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.profiles() })
    },
  })
}
