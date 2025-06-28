import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material'
import { Home, Info, Dashboard } from '@mui/icons-material'
import { ThemeToggle } from '../components/ThemeToggle'

export const Route = createRootRoute({
  component: () => (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ mr: 4 }}>
            Jaculus Viz
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
            <Button
              color="inherit"
              component={Link}
              to="/"
              startIcon={<Home />}
              sx={{ '&.active': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/about"
              startIcon={<Info />}
              sx={{ '&.active': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              About
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/dashboard"
              startIcon={<Dashboard />}
              sx={{ '&.active': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              Dashboard
            </Button>
          </Box>
          <ThemeToggle />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
        <Outlet />
      </Container>
      {/* <TanStackRouterDevtools />  */} {/* Enable this line to use the devtools */}
    </>
  ),
})
