import { createBrowserRouter } from 'react-router-dom'

import RootLayout from '@/layouts/root-layout'
import DashboardPage from '@/pages/dashboard'
import StoragePage from '@/pages/storage'
import SettingsPage from '@/pages/settings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: '', element: <DashboardPage />, index: true },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'storage', element: <StoragePage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])

export default router
