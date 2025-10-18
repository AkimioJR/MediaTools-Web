import '@/styles/globals.css'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'

import { router } from '@/router'
import { ToastProvider } from '@/components/toast-provider'
import { ModalProvider } from '@/components/modal-provider'
import { useAppStore } from '@/stores/useAppStore'

function App() {
  const { loadProviders, loadMediaLibraries, loadAppStatus } = useAppStore()

  useEffect(() => {
    loadProviders()
    loadMediaLibraries()
    loadAppStatus()
  }, [])

  return (
    <>
      <ModalProvider>
        <RouterProvider router={router} />
        <ToastProvider />
      </ModalProvider>
    </>
  )
}

export default App
