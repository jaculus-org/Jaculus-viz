import { useDevice } from '@/context/device'
import { useDeviceData } from '@/context/deviceData/useDeviceData'
import { getURLParameter, updateURLParameter } from '@/utils/urlUtils.ts'
import { Timeline } from '@mui/icons-material'
import { Alert, Box, Paper, TextField, Typography } from '@mui/material'
import type { MenuProps as MuiMenuProps } from '@mui/material/Menu'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  type ChartOptions,
} from 'chart.js'
import autocolors from 'chartjs-plugin-autocolors'
import zoomPlugin from 'chartjs-plugin-zoom'
import { useEffect, useRef, useState } from 'react'
import ChartContainer from './ChartContainer'
import ChartKeySelector from './ChartKeySelector'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  autocolors
)

interface DataPoint {
  x: number
  y: number
}

function Chart() {
  const { device, connected } = useDevice()
  const deviceData = useDeviceData(device)
  const dataKeys = deviceData.getDataKeys()
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>(
    dataKeys.length > 0 ? [dataKeys[0]] : []
  )
  const [maxDataPoints, setMaxDataPoints] = useState(100)
  const [dataHistory, setDataHistory] = useState<Map<string | number, DataPoint[]>>(new Map())
  const chartRef = useRef<ChartJS<'line', DataPoint[], number>>(null)

  const datasets = selectedKeys.map((key, index) => {
    const keyHistory = dataHistory.get(key) || []
    const colors = [
      '#5470c6',
      '#91cc75',
      '#fac858',
      '#ee6666',
      '#73c0de',
      '#3ba272',
      '#fc8452',
      '#9a60b4',
      '#ea7ccc',
    ]

    return {
      label: `Key: ${key}`,
      data: keyHistory,
      borderWidth: 2,
      pointRadius: 1,
      tension: 0.1,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '20',
    }
  })

  // Load selectedKeys and maxDataPoints from URL on mount
  useEffect(() => {
    const urlKeys = getURLParameter('keys')
    const urlMaxPoints = getURLParameter('maxPoints')

    if (urlKeys) {
      const keys = urlKeys.split(',').filter((k: string | number) => dataKeys.includes(k))
      if (keys.length > 0) setSelectedKeys(keys)
    } else {
      setSelectedKeys(dataKeys.length > 0 ? [dataKeys[0]] : [])
    }

    if (urlMaxPoints) {
      const points = parseInt(urlMaxPoints, 10)
      if (!isNaN(points) && points > 0) setMaxDataPoints(points)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKeys.join(',')])

  // Update URL when selectedKeys or maxDataPoints change
  useEffect(() => {
    if (selectedKeys.length > 0) {
      updateURLParameter('keys', selectedKeys.join(','))
    } else {
      updateURLParameter('keys', '')
    }
  }, [selectedKeys])

  useEffect(() => {
    updateURLParameter('maxPoints', maxDataPoints.toString())
  }, [maxDataPoints])

  // Update data history for sliding window
  useEffect(() => {
    if (deviceData.isPaused) return

    const newDataHistory = new Map(dataHistory)

    selectedKeys.forEach(key => {
      const dataForKey = deviceData.getDataForKey(key)
      if (dataForKey.length > 0) {
        let keyHistory = newDataHistory.get(key) || []

        // Add new data points
        dataForKey.forEach(entry => {
          const existingIndex = keyHistory.findIndex(h => h.x === entry.timestamp)
          if (existingIndex === -1) {
            keyHistory.push({
              x: entry.timestamp,
              y: entry.value,
            })
          }
        })

        // Sort by timestamp and keep only the last maxDataPoints
        keyHistory.sort((a, b) => a.x - b.x)
        if (keyHistory.length > maxDataPoints) {
          keyHistory = keyHistory.slice(-maxDataPoints)
        }

        newDataHistory.set(key, keyHistory)
      }
    })

    setDataHistory(newDataHistory)
  }, [deviceData, selectedKeys, maxDataPoints, deviceData.isPaused])

  // Clear local data history when device data is cleared
  useEffect(() => {
    const totalDataCount = deviceData.getDataCount()
    if (totalDataCount === 0) {
      setDataHistory(new Map())
    }
  }, [deviceData.getDataCount()])

  const chartData = {
    datasets,
  }

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Real-time Data Chart',
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
        },
        pan: {
          enabled: true,
          mode: 'xy' as const,
        },
      },
      autocolors: {
        mode: 'dataset' as const,
      },
    },
    scales: {
      x: {
        type: 'linear' as const,
        title: {
          display: true,
          text: 'Time',
        },
        ticks: {
          callback: function (value: any) {
            return new Date(value).toLocaleTimeString()
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  }

  const handleMaxPointsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10)
    if (!isNaN(value) && value > 0) {
      setMaxDataPoints(value)
    }
  }

  if (!connected) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper
          sx={{
            p: 4,
            height: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Alert severity="info" icon={<Timeline />}>
            Connect to a device to view real-time data chart
          </Alert>
        </Paper>
      </Box>
    )
  }

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps: Partial<MuiMenuProps> = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  }

  return (
    <Box sx={{ p: 3, height: '85vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timeline sx={{ fontSize: '1.8rem' }} />
          Real-time Data Chart
          {deviceData.isPaused && (
            <Typography variant="caption" sx={{ ml: 2, color: 'warning.main' }}>
              (Paused - Zoom and pan enabled)
            </Typography>
          )}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            label="Max Data Points"
            type="number"
            value={maxDataPoints}
            onChange={handleMaxPointsChange}
            size="small"
            sx={{ width: 140 }}
            inputProps={{ min: 10, max: 1000 }}
          />

          {/* <Button
            variant="contained"
            onClick={handlePauseResume}
            startIcon={deviceData.isPaused ? <PlayArrow /> : <Pause />}
            color={deviceData.isPaused ? 'success' : 'warning'}
          >
            {deviceData.isPaused ? 'Resume' : 'Pause'}
          </Button> */}

          {dataKeys.length > 0 && (
            <ChartKeySelector
              dataKeys={dataKeys}
              selectedKeys={selectedKeys}
              onChange={setSelectedKeys}
              getDataCountForKey={deviceData.getDataCountForKey}
              MenuProps={MenuProps}
            />
          )}
        </Box>
      </Box>
      <ChartContainer
        chartData={chartData}
        chartOptions={chartOptions}
        chartRef={chartRef}
        chartKey={(connected ? 'connected' : 'disconnected') + '-' + selectedKeys.join(',')}
      />
      {/* NOTE: Make sure you have 'react-router-dom' and '@types/react-router-dom' installed in your project. */}
    </Box>
  )
}

export default Chart
