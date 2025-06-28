import ConnectionControl from '@/components/ConnectionControl'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Home, Info, Terminal } from '@mui/icons-material'
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import { Link } from '@tanstack/react-router'
import type { FC } from 'react'

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
            to="/terminal"
            startIcon={<Terminal />}
            sx={{ '&.active': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
          >
            Terminal
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
