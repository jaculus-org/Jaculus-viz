import { createFileRoute } from '@tanstack/react-router'
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack
} from '@mui/material'
import {
  TrendingUp,
  BarChart,
  Dashboard as DashboardIcon,
  Memory,
  Code,
  Speed,
  Router,
  Brush
} from '@mui/icons-material'

export const Route = createFileRoute('/about')({
  component: () => <About />,
})

function About() {
  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        About Jac Viz
      </Typography>

      <Box sx={{ maxWidth: 600 }}>
        <Typography variant="body1" color="text.secondary" paragraph>
          Jac Viz is a visualization application for the Jaculus platform, providing
          real-time monitoring and analysis capabilities for embedded systems.
        </Typography>

        <Stack spacing={3}>
          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h2" gutterBottom>
              Features
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <TrendingUp color="primary" />
                </ListItemIcon>
                <ListItemText primary="Real-time data visualization" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <BarChart color="primary" />
                </ListItemIcon>
                <ListItemText primary="Interactive charts and graphs" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DashboardIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="System monitoring dashboard" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Memory color="primary" />
                </ListItemIcon>
                <ListItemText primary="ESP32 integration support" />
              </ListItem>
            </List>
          </Paper>

          <Paper elevation={1} sx={{ p: 3, backgroundColor: 'success.light', color: 'success.contrastText' }}>
            <Typography variant="h2" gutterBottom>
              Technology Stack
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Code sx={{ color: 'success.contrastText' }} />
                </ListItemIcon>
                <ListItemText primary="React 19 with TypeScript" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Speed sx={{ color: 'success.contrastText' }} />
                </ListItemIcon>
                <ListItemText primary="Vite for fast development" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Router sx={{ color: 'success.contrastText' }} />
                </ListItemIcon>
                <ListItemText primary="TanStack Router for routing" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Brush sx={{ color: 'success.contrastText' }} />
                </ListItemIcon>
                <ListItemText primary="Material-UI for modern design" />
              </ListItem>
            </List>
          </Paper>
        </Stack>
      </Box>
    </Box>
  )
}
