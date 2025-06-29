import { ThemeProvider } from '@/context'
import NotificationProvider from '@/providers/NotificationProvider.tsx'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import the generated route tree
import { DeviceProvider } from '@/context/device'
import { DeviceDataProvider } from '@/context/deviceData'
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <ThemeProvider>
        <DeviceProvider>
          <DeviceDataProvider>
            <RouterProvider router={router} />
          </DeviceDataProvider>
        </DeviceProvider>
      </ThemeProvider>
    </NotificationProvider>
  </StrictMode>
)
