import { useDevice } from '@/context/device'
import { useDeviceData } from '@/context/deviceData/useDeviceData'
import { getURLParameter, updateURLParameter } from '@/utils/urlUtils.ts'
import { Timeline } from '@mui/icons-material'
import { Alert, Box, Paper, TextField, Typography } from '@mui/material'
import type { MenuProps as MuiMenuProps } from '@mui/material/Menu'
import type { EChartsOption } from 'echarts'
import { useEffect, useRef, useState } from 'react'
import ChartKeySelector from './ChartKeySelector'
import OscilloscopeContainer from './OscilloscopeContainer'

interface DataPoint {
  timestamp: number
  value: number
}

export default function Oscilloscope() {
  const { device, connected } = useDevice()
  const deviceData = useDeviceData(device)
  const dataKeys = deviceData.getDataKeys()
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>(
    dataKeys.length > 0 ? [dataKeys[0]] : []
  )
  // const [isPaused, setIsPaused] = useState(false)
  const [maxDataPoints, setMaxDataPoints] = useState(100)
  const chartRef = useRef<any>(null)
  const [dataHistory, setDataHistory] = useState<Map<string | number, DataPoint[]>>(new Map())

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
          const existingIndex = keyHistory.findIndex(h => h.timestamp === entry.timestamp)
          if (existingIndex === -1) {
            keyHistory.push({
              timestamp: entry.timestamp,
              value: entry.value,
            })
          }
        })

        // Sort by timestamp and keep only the last maxDataPoints
        keyHistory.sort((a, b) => a.timestamp - b.timestamp)
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

  const chartOption: EChartsOption = {
    title: {
      text: 'Real-time Data Chart',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        if (!params || params.length === 0) return ''
        const timestamp = params[0].data[0]
        const date = new Date(timestamp)
        let result = `${date.toLocaleTimeString()}<br/>`
        params.forEach((param: any) => {
          result += `${param.seriesName}: ${param.data[1]}<br/>`
        })
        return result
      },
    },
    legend: {
      data: selectedKeys.map(key => `Key: ${key}`),
      top: 30,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    toolbox: {
      show: deviceData.isPaused,
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        restore: {},
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: (value: number) => {
          return new Date(value).toLocaleTimeString()
        },
      },
    },
    yAxis: {
      type: 'value',
      scale: true,
      name: 'Value',
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
        disabled: !deviceData.isPaused,
      },
      {
        type: 'slider',
        start: 0,
        end: 100,
        show: deviceData.isPaused,
      },
    ],
    series: selectedKeys.map((key, index) => {
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
        name: `Key: ${key}`,
        type: 'line',
        smooth: true,
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: colors[index % colors.length],
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: colors[index % colors.length] + '80',
              },
              {
                offset: 1,
                color: colors[index % colors.length] + '00',
              },
            ],
          },
        },
        data: keyHistory.map(point => [point.timestamp, point.value]),
      }
    }),
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
    <Box sx={{ p: 3, height: '90vh', display: 'flex', flexDirection: 'column' }}>
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

      <OscilloscopeContainer
        chartOption={chartOption}
        chartRef={chartRef}
        chartKey={
          (connected ? 'connected' : 'disconnected') +
          '-' +
          selectedKeys.join(',') +
          '-' +
          maxDataPoints
        }
        isPaused={deviceData.isPaused}
      />
    </Box>
  )
}
