import { useDevice } from '@/context/device'
import { useDeviceData } from '@/context/deviceData/useDeviceData'
import { getURLParameter, updateURLParameter } from '@/utils/urlUtils.ts'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import { Alert, Box, Paper, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'

function ColorChart() {
  const theme = useTheme()
  const { device, connected } = useDevice()
  const deviceData = useDeviceData(device)
  const dataKeys = deviceData.getDataKeys()

  // Default keys for RGB
  const [rKey, setRKey] = useState('r')
  const [gKey, setGKey] = useState('g')
  const [bKey, setBKey] = useState('b')

  // Load keys from URL on mount
  useEffect(() => {
    const urlRKey = getURLParameter('rKey')
    const urlGKey = getURLParameter('gKey')
    const urlBKey = getURLParameter('bKey')

    if (urlRKey) setRKey(urlRKey)
    if (urlGKey) setGKey(urlGKey)
    if (urlBKey) setBKey(urlBKey)
  }, [])

  // Update URL when keys change
  useEffect(() => {
    updateURLParameter('rKey', rKey)
    updateURLParameter('gKey', gKey)
    updateURLParameter('bKey', bKey)
  }, [rKey, gKey, bKey])

  // Get latest values for RGB keys
  const getLatestValue = (key: string): number => {
    const dataForKey = deviceData.getDataForKey(key)
    if (dataForKey.length === 0) return 0
    const latestEntry = dataForKey[dataForKey.length - 1]
    const value = Math.round(Math.max(0, Math.min(255, latestEntry.value)))
    return value
  }

  const rValue = getLatestValue(rKey)
  const gValue = getLatestValue(gKey)
  const bValue = getLatestValue(bKey)

  const rgbColor = `rgb(${rValue}, ${gValue}, ${bValue})`

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
          <Alert severity="info" icon={<ColorLensIcon />}>
            Connect to a device to view real-time color data
          </Alert>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ColorLensIcon sx={{ fontSize: '1.8rem' }} />
          Real-time Color Display
        </Typography>
      </Box>

      {/* Key Selection Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Data Key Configuration
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Red Key"
            value={rKey}
            onChange={e => setRKey(e.target.value)}
            size="small"
            sx={{ minWidth: 100 }}
          />
          <TextField
            label="Green Key"
            value={gKey}
            onChange={e => setGKey(e.target.value)}
            size="small"
            sx={{ minWidth: 100 }}
          />
          <TextField
            label="Blue Key"
            value={bKey}
            onChange={e => setBKey(e.target.value)}
            size="small"
            sx={{ minWidth: 100 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Available keys: {dataKeys.join(', ')}
        </Typography>
      </Paper>

      {/* Color Display */}
      <Paper
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        {/* Color Circle */}
        <Box
          sx={{
            width: 300,
            height: 300,
            borderRadius: '50%',
            backgroundColor: rgbColor,
            border: `4px solid ${theme.palette.divider}`,
            marginBottom: 3,
            boxShadow: theme.shadows[6],
            transition: 'background-color 0.3s ease',
          }}
        />

        {/* Color Information */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            {rgbColor}
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
            <Typography variant="body1">
              <strong>R ({rKey}):</strong> {rValue}
            </Typography>
            <Typography variant="body1">
              <strong>G ({gKey}):</strong> {gValue}
            </Typography>
            <Typography variant="body1">
              <strong>B ({bKey}):</strong> {bValue}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Values are automatically clamped to 0-255 range
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default ColorChart
