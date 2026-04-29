import { useNavigate } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import { useMe } from '#/hooks/useMe'
import { logout } from '#/functions/auth'
import { useQueryClient } from '@tanstack/react-query'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'

export function AccountPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: user } = useMe()

  async function handleLogout() {
    await logout()
    queryClient.clear()
    navigate('/login')
  }

  return (
    <AppShell>
      <div className="max-w-5xl">
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your profile and access details.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.avatar_url ?? ''} alt="@username" />
              <AvatarFallback className="bg-muted" />
            </Avatar>
            <h2 className="mt-4 text-xl font-semibold">
              {user?.username ?? 'User'}
            </h2>
            <p className="text-sm text-muted-foreground">@{user?.username}</p>
            <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div
              className="bg-background border border-border p-5"
              style={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                borderRadius: 4,
              }}
            >
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Role
              </div>
              <div className="mt-2 text-2xl font-semibold">
                {user?.role ?? 'N/A'}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Access level assigned to your account.
              </p>
            </div>
            <div
              className="bg-background border border-border p-5"
              style={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                borderRadius: 4,
              }}
            >
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Member Since
              </div>
              <div className="mt-2 text-2xl font-semibold">-</div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <button
            onClick={handleLogout}
            className="px-5 h-10 text-sm font-medium bg-foreground text-background hover:opacity-90"
            style={{ borderRadius: 4 }}
          >
            Logout
          </button>
        </div>
      </div>
    </AppShell>
  )
}
