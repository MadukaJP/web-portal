import { Link } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { ProfileTable } from '@/components/ProfileTable'
import { useProfiles } from '#/hooks/useProfiles'

function MetricCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div
      className="bg-background border border-border p-5"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderRadius: 4 }}
    >
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-3xl font-semibold text-foreground tabular-nums">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { data, isLoading } = useProfiles({ page: 1, limit: 5 })
  const profiles = data?.data ?? []
  const male = profiles.filter(
    (profile) => profile.gender.toLowerCase() === 'male',
  ).length
  const female = profiles.filter(
    (profile) => profile.gender.toLowerCase() === 'female',
  ).length
  const countries = new Set(profiles.map((profile) => profile.country_id)).size

  return (
    <AppShell>
      <div className="max-w-6xl">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of profile intelligence data.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <MetricCard label="Total Profiles" value={data?.total ?? 0} />
          <MetricCard label="Male (this page)" value={male} />
          <MetricCard label="Female (this page)" value={female} />
          <MetricCard label="Countries (this page)" value={countries} />
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-3">Recent Profiles</h2>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading recent profiles...
            </p>
          ) : (
            <ProfileTable profiles={profiles} />
          )}
          <div className="mt-4">
            <Link
              to="/profiles"
              className="text-sm text-foreground hover:underline font-medium"
            >
              View all profiles →
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
