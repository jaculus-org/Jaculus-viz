import { useDevice } from '@/context/device'
import { useDeviceData } from '@/context/deviceData/useDeviceData'
import { getURLParameter, updateURLParameter } from '@/utils/urlUtils.ts'
import { Timeline } from '@mui/icons-material'
import { Alert, Box, Paper, Typography } from '@mui/material'
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
  const chartRef = useRef<ChartJS<'line', DataPoint[], number>>(null)

  const datasets = selectedKeys.map(key => {
    const dataForKey = deviceData.getDataForKey(key)
    const dataPoints: DataPoint[] = dataForKey.map(entry => ({
      x: entry.timestamp,
      y: entry.value,
    }))
    return {
      label: `Key: ${key}`,
      data: dataPoints,
      borderWidth: 2,
      pointRadius: 2,
      tension: 0.1,
    }
  })

  // Load selectedKeys from URL on mount
  useEffect(() => {
    const urlKeys = getURLParameter('keys')
    if (urlKeys) {
      const keys = urlKeys.split(',').filter((k: string | number) => dataKeys.includes(k))
      if (keys.length > 0) setSelectedKeys(keys)
    } else {
      setSelectedKeys(dataKeys.length > 0 ? [dataKeys[0]] : [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKeys.join(',')])

  // Update URL when selectedKeys change
  useEffect(() => {
    if (selectedKeys.length > 0) {
      updateURLParameter('keys', selectedKeys.join(','))
    } else {
      updateURLParameter('keys', '')
    }
  }, [selectedKeys])

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
        </Typography>
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
