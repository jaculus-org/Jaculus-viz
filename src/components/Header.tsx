import ConnectionControl from '@/components/ConnectionControl'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Close, Home, Info, Menu, Terminal } from '@mui/icons-material'
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Link } from '@tanstack/react-router'
import type { FC } from 'react'
import { useState } from 'react'

export interface HeaderProps {
  onConnectionChange?: (connected: boolean) => void
}

const Header: FC<HeaderProps> = ({ onConnectionChange }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationItems = [
    { to: '/', label: 'Home', icon: <Home /> },
    { to: '/terminal', label: 'Terminal', icon: <Terminal /> },
    { to: '/about', label: 'About', icon: <Info /> },
  ]

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: isMobile ? 1 : 0, mr: isMobile ? 0 : 4 }}
          >
            JacViz
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
              {navigationItems.map(item => (
                <Button
                  key={item.to}
                  color="inherit"
                  component={Link}
                  to={item.to}
                  startIcon={item.icon}
                  sx={{ '&.active': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Mobile Controls */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ConnectionControl onConnectionChange={onConnectionChange} />
              <ThemeToggle />
              <IconButton
                color="inherit"
                aria-label="open navigation menu"
                edge="end"
                onClick={handleMobileMenuToggle}
              >
                <Menu />
              </IconButton>
            </Box>
          )}

          {/* Desktop Controls */}
          {!isMobile && (
            <>
              <Box sx={{ mr: 2 }}>
                <ConnectionControl onConnectionChange={onConnectionChange} />
              </Box>
              <ThemeToggle />
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Navigation</Typography>
          <IconButton onClick={handleMobileMenuClose}>
            <Close />
          </IconButton>
        </Box>

        <List>
          {navigationItems.map(item => (
            <ListItem key={item.to} disablePadding>
              <ListItemButton
                component={Link}
                to={item.to}
                onClick={handleMobileMenuClose}
                sx={{
                  '&.active': {
                    backgroundColor: theme.palette.action.selected,
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  )
}

export default Header
