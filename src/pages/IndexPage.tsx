import { Navigate } from 'react-router-dom'
import { useMe } from '#/hooks/useMe'

export function IndexPage() {
  const { data, isLoading } = useMe()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (data) {
    return <Navigate to="/dashboard" replace />
  }

  return <Navigate to="/login" replace />
}
