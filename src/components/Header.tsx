import type { FC } from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Home, Info, Dashboard } from '@mui/icons-material'
import { Link } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/ThemeToggle'
import ConnectionControl from '@/components/ConnectionControl'

export interface HeaderProps {
  onConnectionChange?: (connected: boolean) => void
}

const Header: FC<HeaderProps> = ({ onConnectionChange }) => {
  return (
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

        {/* Connection Control */}
        <Box sx={{ mr: 2 }}>
          <ConnectionControl onConnectionChange={onConnectionChange} />
        </Box>

        <ThemeToggle />
      </Toolbar>
    </AppBar>
  )
}

export default Header
