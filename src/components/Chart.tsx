import { useDeviceData } from '@/context/deviceData/useDeviceData'
import { Timeline } from '@mui/icons-material'
import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useDevice } from '@/context/device'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
)

interface DataPoint {
  x: number
  y: number
}

const Chart: FC = () => {
  const { device } = useDevice()
  const deviceData = useDeviceData(device)
  const [selectedKey, setSelectedKey] = useState<string | number>(0)
  const [isConnected, setIsConnected] = useState(false)
  const chartRef = useRef<ChartJS<'line', DataPoint[], number>>(null)

  // Handle device connection
  useEffect(() => {
    setIsConnected(!!device)
  }, [device])

  // Get data for the selected key
  const dataForKey = deviceData.getDataForKey(selectedKey)
  const dataPoints: DataPoint[] = dataForKey.map(entry => ({
    x: entry.timestamp,
    y: entry.value,
  }))

  // Auto-select the first available key if none selected
  useEffect(() => {
    const keys = deviceData.getDataKeys()
    if (keys.length > 0 && !keys.includes(selectedKey)) {
      setSelectedKey(keys[0])
    }
  }, [deviceData.getDataKeys(), selectedKey])

  const chartData = {
    datasets: [
      {
        label: `Data Stream - Key: ${selectedKey}`,
        data: dataPoints,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        pointRadius: 1,
        tension: 0.1,
      },
    ],
  }

  const chartOptions = {
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
          }}
        >
          <Alert severity="info" icon={<Timeline />}>
            Connect to a device to view real-time data chart
          </Alert>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timeline sx={{ fontSize: '1.8rem' }} />
          Real-time Data Chart
        </Typography>

        {deviceData.getDataKeys().length > 0 && (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Data Key</InputLabel>
            <Select
              value={selectedKey}
              label="Data Key"
              onChange={e => setSelectedKey(e.target.value)}
            >
              {deviceData.getDataKeys().map(key => (
                <MenuItem key={key} value={key}>
                  {key} ({deviceData.getDataCountForKey(key)} pts)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      <Paper sx={{ flex: 1, p: 2, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ height: '100%' }}>
          <Line ref={chartRef} data={chartData} options={chartOptions} />
        </Box>
      </Paper>
    </Box>
  )
}

export default Chart
