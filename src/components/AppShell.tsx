import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMe } from '#/hooks/useMe'
import { useQueryClient } from '@tanstack/react-query'
import { logout } from '#/functions/auth'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/profiles', label: 'Profiles' },
  { to: '/search', label: 'Search' },
  { to: '/account', label: 'Account' },
] as const

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data: user } = useMe()
  const queryClient = useQueryClient()

  async function handleLogout() {
    await logout()
    queryClient.clear()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 md:px-6 h-14">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1 -ml-1"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <MenuIcon />
            </button>
            <Link
              to="/dashboard"
              className="font-semibold tracking-tight text-base"
            >
              Insighta Labs+
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar_url ?? ''} alt="@username" />
              <AvatarFallback className="bg-muted" />
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm text-foreground hidden sm:inline">
                @{user?.username ?? 'user'}
              </span>
              <span className="text-xs text-muted-foreground">
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-foreground hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`${
            mobileOpen ? 'block' : 'hidden'
          } md:block w-56 shrink-0 border-r border-border bg-background min-h-[calc(100vh-3.5rem)] sticky top-14 self-start`}
        >
          <nav className="py-4">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.to)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-5 py-2.5 text-sm border-l-4 ${
                    isActive
                      ? 'border-foreground font-semibold text-foreground bg-muted'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
