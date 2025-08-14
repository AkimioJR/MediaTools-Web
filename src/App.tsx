import '@/styles/globals.css'
import { RouterProvider } from 'react-router-dom'

import { router } from '@/router'
import { ToastProvider } from '@/components/toast-provider'
import { ModalProvider } from '@/components/modal-provider'

function App() {
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
