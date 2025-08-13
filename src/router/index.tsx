import { createBrowserRouter } from 'react-router-dom'

import RootLayout from '@/layouts/root-layout'
import DashboardPage from '@/pages/dashboard'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [{ path: 'dashboard', element: <DashboardPage />, index: true }],
  },
])

export default router
