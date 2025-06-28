import Header from '@/components/Header'
import { Container } from '@mui/material'
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
        <Outlet />
      </Container>
      {/* <TanStackRouterDevtools />  */} {/* Enable this line to use the devtools */}
    </>
  ),
})
