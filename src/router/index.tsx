import { createBrowserRouter } from 'react-router-dom'

import RootLayout from '@/layouts/root-layout'
import DashboardPage from '@/pages/dashboard'
import StoragePage from '@/pages/storage'
import SettingsPage from '@/pages/settings'
import NotFoundPage from '@/pages/404'
import HistoryPage from '@/pages/history'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: '', element: <DashboardPage />, index: true },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'storage', element: <StoragePage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
