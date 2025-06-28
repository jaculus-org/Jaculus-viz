import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack
} from '@mui/material'
import {
  Computer,
  Memory,
  Schedule,
  WifiTethering,
  WifiOff
} from '@mui/icons-material'

export const Route = createFileRoute('/dashboard')({
  component: () => <Dashboard />,
})

function Dashboard() {
  const [data, setData] = useState<number[]>([])
  const [isConnected, setIsConnected] = useState(false)

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => [
        ...prev.slice(-9), // Keep last 9 values
        Math.floor(Math.random() * 100)
      ])
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const toggleConnection = () => {
    setIsConnected(!isConnected)
  }

  const currentValue = data.length > 0 ? data[data.length - 1] : 0
  const memoryValue = data.length > 0 ? Math.floor(data[data.length - 1] * 0.8) : 0

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h1">
          Dashboard
        </Typography>
        <Button
          variant={isConnected ? "contained" : "outlined"}
          color={isConnected ? "success" : "error"}
          startIcon={isConnected ? <WifiTethering /> : <WifiOff />}
          onClick={toggleConnection}
        >
          {isConnected ? 'Connected' : 'Disconnected'}
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Computer color="primary" sx={{ mr: 1 }} />
                <Typography variant="h3" color="primary">
                  CPU Usage
                </Typography>
              </Box>
              <Typography variant="h2" color="primary" gutterBottom>
                {currentValue}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={currentValue}
                color="primary"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                Real-time monitoring
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Memory color="success" sx={{ mr: 1 }} />
                <Typography variant="h3" color="success.main">
                  Memory
                </Typography>
              </Box>
              <Typography variant="h2" color="success.main" gutterBottom>
                {memoryValue}MB
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(memoryValue / 512) * 100}
                color="success"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                Available: 512MB
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h3" color="secondary">
                  Uptime
                </Typography>
              </Box>
              <Typography variant="h2" color="secondary" gutterBottom>
                12:34:56
              </Typography>
              <Chip
                label="Running stable"
                color="success"
                variant="outlined"
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h2" gutterBottom>
          Real-time Data Visualization
        </Typography>
        <Box
          sx={{
            height: 250,
            backgroundColor: 'background.paper',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            p: 2,
            border: 1,
            borderColor: 'divider'
          }}
        >
          <Stack direction="row" spacing={0.5} sx={{ height: '100%', alignItems: 'flex-end' }}>
            {data.map((value, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: 'primary.main',
                  borderRadius: '4px 4px 0 0',
                  height: `${(value / 100) * 100}%`,
                  width: 20,
                  minHeight: 4,
                  transition: 'height 0.3s ease-out'
                }}
                title={`Value: ${value}`}
              />
            ))}
          </Stack>
          {data.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Waiting for data...
            </Typography>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Chart updates every second with simulated sensor data
        </Typography>
      </Paper>
    </Box>
  )
}
