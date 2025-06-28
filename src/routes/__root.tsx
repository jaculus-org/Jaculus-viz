import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { AppBar, Toolbar, Box, Button, Container, Divider } from '@mui/material'
import { Home, Info, Dashboard } from '@mui/icons-material'

export const Route = createRootRoute({
  component: () => (
    <>
      <AppBar position="static" elevation={1} sx={{ backgroundColor: 'background.paper', color: 'text.primary' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              to="/"
              startIcon={<Home />}
              sx={{ color: 'text.primary' }}
              className="[&.active]:font-bold [&.active]:color-primary"
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/about"
              startIcon={<Info />}
              sx={{ color: 'text.primary' }}
              className="[&.active]:font-bold [&.active]:color-primary"
            >
              About
            </Button>
            <Button
              component={Link}
              to="/dashboard"
              startIcon={<Dashboard />}
              sx={{ color: 'text.primary' }}
              className="[&.active]:font-bold [&.active]:color-primary"
            >
              Dashboard
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Divider />
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Outlet />
      </Container>
      <TanStackRouterDevtools />
    </>
  ),
})
