import HomeLayout from '@/layouts/home'
import { Provider } from '@/provider'

export default function RootLayout() {
  return (
    <Provider>
      <HomeLayout />
    </Provider>
  )
}
