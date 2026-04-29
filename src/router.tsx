import { createBrowserRouter } from 'react-router-dom'
import { IndexPage } from '#/pages/IndexPage'
import { LoginPage } from '#/pages/LoginPage'
import { DashboardPage } from '#/pages/DashboardPage'
import { ProfilesPage } from '#/pages/ProfilesPage'
import { ProfileDetailPage } from '#/pages/ProfileDetailPage'
import { SearchPage } from '#/pages/SearchPage'
import { AccountPage } from '#/pages/AccountPage'
import { ProtectedRoute } from '#/components/ProtectedRoute'
import { NotFoundPage } from '#/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/profiles',
        element: <ProfilesPage />,
      },
      {
        path: '/profiles/:id',
        element: <ProfileDetailPage />,
      },
      {
        path: '/search',
        element: <SearchPage />,
      },
      {
        path: '/account',
        element: <AccountPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
