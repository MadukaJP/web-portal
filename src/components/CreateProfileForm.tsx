import { useState } from 'react'
import { useMe } from '#/hooks/useMe'
import { useCreateProfile } from '#/hooks/useCreateProfile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function CreateProfileForm() {
  const { data: user } = useMe()
  const { mutate, isPending, error } = useCreateProfile()
  const [name, setName] = useState('')

  if (user?.role !== 'admin') return null

  return (
    <div className="mt-4 rounded-md border border-border bg-background p-4">
      <p className="text-sm font-medium text-foreground">Create profile</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Add a new profile entry for the dataset.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="w-full min-w-[240px] flex-1"
        />
        <Button
          onClick={() =>
            mutate(name.trim(), {
              onSuccess: () => setName(''),
            })
          }
          disabled={isPending || !name.trim()}
        >
          {isPending ? 'Creating...' : 'Create Profile'}
        </Button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-destructive">{error.message}</p>
      )}
    </div>
  )
}
