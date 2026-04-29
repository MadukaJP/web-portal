import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useMe } from '#/hooks/useMe'

export function ProtectedRoute() {
  const { data, isLoading, isError } = useMe()
  const navigate = useNavigate()
  const location = useLocation()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      if (isError || !data) {
        navigate('/login', { replace: true, state: { from: location } })
      } else {
        setChecking(false)
      }
    }
  }, [data, isLoading, isError, navigate, location])

  if (checking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return <Outlet />
}
