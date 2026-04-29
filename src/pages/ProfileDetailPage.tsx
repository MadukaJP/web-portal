import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AppShell } from '@/components/AppShell'
import { useMe } from '#/hooks/useMe'
import { useDeleteProfile } from '#/hooks/useDeleteProfile'
import { keys } from '#/lib/query-keys'
import { getProfile } from '#/functions/profiles'

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="py-3 border-b border-border last:border-b-0">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-base text-foreground">{value}</div>
    </div>
  )
}

export function ProfileDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: user } = useMe()
  const { mutate: removeProfile, isPending } = useDeleteProfile()
  const isAdmin = user?.role === 'admin'

  const { data: profile, isLoading } = useQuery({
    queryKey: keys.profile(id!),
    queryFn: () => getProfile(id!),
    enabled: !!id,
    retry: false,
  })

  if (isLoading) {
    return (
      <AppShell>
        <p className="text-sm text-muted-foreground">Loading profile...</p>
      </AppShell>
    )
  }

  if (!profile) {
    return (
      <AppShell>
        <p className="text-sm text-muted-foreground">Profile not found.</p>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-4xl">
        <Link
          to="/profiles"
          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          ← Back to profiles
        </Link>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          {profile.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Profile ID: {profile.id}
        </p>

        <div
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 p-6 bg-background border border-border"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderRadius: 4 }}
        >
          <div>
            <Field label="Gender" value={profile.gender} />
            <Field label="Age" value={profile.age} />
            <Field label="Age Group" value={profile.age_group} />
            <Field
              label="Created"
              value={new Date(profile.created_at).toLocaleString()}
            />
          </div>
          <div>
            <Field label="Country" value={profile.country_name} />
            <Field
              label="Country Probability"
              value={`${(profile.country_probability * 100).toFixed(1)}%`}
            />
            <Field
              label="Gender Probability"
              value={`${(profile.gender_probability * 100).toFixed(1)}%`}
            />
            <Field label="Profile ID" value={profile.id} />
          </div>
        </div>

        {isAdmin && (
          <div className="mt-8">
            <button
              onClick={() =>
                removeProfile(id!, { onSuccess: () => navigate('/profiles') })
              }
              disabled={isPending}
              className="px-4 h-10 text-sm font-medium text-destructive-foreground bg-destructive hover:opacity-90"
              style={{ borderRadius: 4 }}
            >
              {isPending ? 'Deleting...' : 'Delete Profile'}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
