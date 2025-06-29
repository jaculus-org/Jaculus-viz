import { useDevice } from '@/context/device/useDevice'
import {
  Pause,
  PlayArrow,
  Clear,
  Timeline,
  ZoomIn,
  ZoomOut,
  Settings,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  MyLocation,
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Card,
  CardContent,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Chip,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  TimeScale,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import zoomPlugin from 'chartjs-plugin-zoom'
import 'chartjs-adapter-date-fns'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  TimeScale,
  zoomPlugin
)

interface DataPoint {
  x: number // timestamp
  y: number // parsed value
}

interface ChartSettings {
  maxDataPoints: number
  autoScroll: boolean
  showGrid: boolean
  animationDuration: number
  followLive: boolean
}

const Chart: FC = () => {
  const theme = useTheme()
  const { device } = useDevice()
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [parsedCount, setParsedCount] = useState(0)
  const [notParsedCount, setNotParsedCount] = useState(0)
  const [settings, setSettings] = useState<ChartSettings>({
    maxDataPoints: 1000,
    autoScroll: true,
    showGrid: true,
    animationDuration: 0,
    followLive: true,
  })
  const chartRef = useRef<ChartJS<'line', DataPoint[], number>>(null)
  const bufferRef = useRef<string>('')

  // Handle device connection status
  useEffect(() => {
    setIsConnected(!!device)
    if (device) {
      device.programOutput.onData(data => {
        if (!isPaused) {
          processData(data.toString())
        }
      })
    }
  }, [device, isPaused])

  const processData = useCallback(
    (rawData: string) => {
      // Add to buffer
      bufferRef.current += rawData

      // Process complete lines
      const lines = bufferRef.current.split('\n')
      bufferRef.current = lines.pop() || '' // Keep incomplete line in buffer

      lines.forEach(line => {
        const trimmed = line.trim()
        if (trimmed === '') return

        // Try to parse as number
        const parsed = parseFloat(trimmed)

        if (!isNaN(parsed) && isFinite(parsed)) {
          // Successfully parsed
          const timestamp = Date.now()
          const newPoint: DataPoint = { x: timestamp, y: parsed }

          setDataPoints(prev => {
            const updated = [...prev, newPoint]
            // Keep only the last maxDataPoints
            return updated.slice(-settings.maxDataPoints)
          })

          setParsedCount(prev => prev + 1)
        } else {
          // Failed to parse
          setNotParsedCount(prev => prev + 1)
        }
      })
    },
    [settings.maxDataPoints]
  )

  const clearData = () => {
    setDataPoints([])
    setParsedCount(0)
    setNotParsedCount(0)
    bufferRef.current = ''
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const zoomIn = () => {
    if (chartRef.current) {
      chartRef.current.zoom(1.2)
    }
  }

  const zoomOut = () => {
    if (chartRef.current) {
      chartRef.current.zoom(0.8)
    }
  }

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom()
    }
  }

  const panLeft = () => {
    if (chartRef.current) {
      chartRef.current.pan({ x: -50 }, undefined, 'default')
    }
  }

  const panRight = () => {
    if (chartRef.current) {
      chartRef.current.pan({ x: 50 }, undefined, 'default')
    }
  }

  const followLive = () => {
    if (chartRef.current && dataPoints.length > 0) {
      const chart = chartRef.current
      const latestTime = dataPoints[dataPoints.length - 1].x
      const timeRange = 60000 // Show last 60 seconds

      chart.zoomScale('x', { min: latestTime - timeRange, max: latestTime }, 'default')
      setSettings(prev => ({ ...prev, followLive: true }))
    }
  }

  const chartData = {
    datasets: [
      {
        label: 'Data Stream',
        data: dataPoints,
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main + '20',
        borderWidth: 2,
        pointRadius: 1,
        pointHoverRadius: 4,
        tension: 0.1,
        fill: false,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: settings.animationDuration,
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme.palette.text.primary,
        },
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy' as const,
          speed: 0.1,
          onZoom: () => handleChartInteraction(),
        },
        pan: {
          enabled: true,
          mode: 'xy' as const,
          speed: 10,
          threshold: 10,
          onPan: () => handleChartInteraction(),
        },
        limits: {
          x: {
            min: 'original' as const,
            max: 'original' as const,
            minRange: 1000, // Minimum 1 second range
          },
          y: {
            min: 'original' as const,
            max: 'original' as const,
            minRange: 0.1,
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: 'Time',
          color: theme.palette.text.primary,
        },
        grid: {
          display: settings.showGrid,
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
          callback: function (value: any) {
            // Format timestamp to readable time
            return new Date(value).toLocaleTimeString()
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
          color: theme.palette.text.primary,
        },
        grid: {
          display: settings.showGrid,
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
    },
    onHover: (event: any, elements: any[]) => {
      event.native.target.style.cursor = elements.length > 0 ? 'crosshair' : 'default'
    },
  }

  // Auto-scroll to latest data
  useEffect(() => {
    if (settings.followLive && chartRef.current && dataPoints.length > 0 && !isPaused) {
      const chart = chartRef.current
      const latestTime = dataPoints[dataPoints.length - 1].x
      const timeRange = 60000 // Show last 60 seconds

      // Only update if we're close to the end (within 5 seconds)
      const currentMax = chart.scales.x.max
      if (!currentMax || latestTime - currentMax < 5000) {
        chart.zoomScale('x', { min: latestTime - timeRange, max: latestTime }, 'none')
      }
    }
  }, [dataPoints, settings.followLive, isPaused])

  // Disable follow live when user manually pans/zooms
  const handleChartInteraction = () => {
    if (settings.followLive) {
      setSettings(prev => ({ ...prev, followLive: false }))
    }
  }

  if (!isConnected) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper
          sx={{
            p: 4,
            height: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            boxShadow: theme.shadows[3],
          }}
        >
          <Alert
            severity="info"
            icon={<Timeline />}
            sx={{
              fontSize: '1.1rem',
              '& .MuiAlert-message': {
                display: 'flex',
                alignItems: 'center',
              },
            }}
          >
            Connect to a device to view real-time data chart
          </Alert>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timeline sx={{ color: theme.palette.primary.main, fontSize: '1.8rem' }} />
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
            }}
          >
            Real-time Data Chart
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={`Parsed: ${parsedCount}`} color="success" variant="outlined" size="small" />
          <Chip
            label={`Skipped: ${notParsedCount}`}
            color="warning"
            variant="outlined"
            size="small"
          />
        </Box>
      </Box>

      {/* Controls */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Tooltip title={isPaused ? 'Resume' : 'Pause'}>
              <IconButton onClick={togglePause} color={isPaused ? 'error' : 'primary'} size="large">
                {isPaused ? <PlayArrow /> : <Pause />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Clear data">
              <IconButton onClick={clearData} size="large">
                <Clear />
              </IconButton>
            </Tooltip>

            <Tooltip title="Zoom in">
              <IconButton onClick={zoomIn} size="large">
                <ZoomIn />
              </IconButton>
            </Tooltip>

            <Tooltip title="Zoom out">
              <IconButton onClick={zoomOut} size="large">
                <ZoomOut />
              </IconButton>
            </Tooltip>

            <Tooltip title="Reset zoom">
              <IconButton onClick={resetZoom} size="large">
                <Settings />
              </IconButton>
            </Tooltip>

            <Tooltip title="Pan left">
              <IconButton onClick={panLeft} size="large">
                <KeyboardArrowLeft />
              </IconButton>
            </Tooltip>

            <Tooltip title="Pan right">
              <IconButton onClick={panRight} size="large">
                <KeyboardArrowRight />
              </IconButton>
            </Tooltip>

            <Tooltip title="Follow live data">
              <IconButton
                onClick={followLive}
                size="large"
                color={settings.followLive ? 'primary' : 'default'}
              >
                <MyLocation />
              </IconButton>
            </Tooltip>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.followLive}
                  onChange={e => setSettings(prev => ({ ...prev, followLive: e.target.checked }))}
                />
              }
              label="Follow live"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.showGrid}
                  onChange={e => setSettings(prev => ({ ...prev, showGrid: e.target.checked }))}
                />
              }
              label="Show grid"
            />

            <TextField
              label="Max points"
              type="number"
              size="small"
              value={settings.maxDataPoints}
              onChange={e =>
                setSettings(prev => ({
                  ...prev,
                  maxDataPoints: Math.max(100, parseInt(e.target.value) || 1000),
                }))
              }
              sx={{ width: 120 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Chart */}
      <Paper
        sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: theme.shadows[4],
          position: 'relative',
        }}
      >
        <Box sx={{ height: '100%', position: 'relative' }}>
          <Line ref={chartRef} data={chartData} options={chartOptions} />
        </Box>

        {/* Status indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'background.paper',
            px: 2,
            py: 1,
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: isPaused ? 'warning.main' : 'success.main',
            }}
          />
          <Typography variant="caption">{isPaused ? 'Paused' : 'Live'}</Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default Chart
