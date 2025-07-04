import { useDevice } from '@/context/device/useDevice'
import { getURLParameter, updateURLParameter } from '@/utils/urlUtils.ts'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Buffer } from 'buffer'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

interface ColorData {
  r: number
  g: number
  b: number
}

export interface ColorBoxProps {
  height?: number | string
}

export default function ColorBox({ height = '400px' }: ColorBoxProps) {
  const theme = useTheme()
  const { device } = useDevice()
  const { enqueueSnackbar } = useSnackbar()
  const [color, setColor] = useState<ColorData>({ r: 123, g: 43, b: 65 }) // Default color
  const [inputR, setInputR] = useState('123')
  const [inputG, setInputG] = useState('43')
  const [inputB, setInputB] = useState('65')
  const [isConnected, setIsConnected] = useState(false)

  // RGB key configuration with URL parameter support
  const [rKey, setRKey] = useState('r')
  const [gKey, setGKey] = useState('g')
  const [bKey, setBKey] = useState('b')

  // Load keys from URL parameters on mount
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

  // Parse color data from device input (format: r:123;g:43;b:65)
  const parseColorData = (data: string) => {
    const rPattern = `${rKey}:(\\d+)`
    const gPattern = `${gKey}:(\\d+)`
    const bPattern = `${bKey}:(\\d+)`

    const rMatch = data.match(new RegExp(rPattern))
    const gMatch = data.match(new RegExp(gPattern))
    const bMatch = data.match(new RegExp(bPattern))

    if (rMatch || gMatch || bMatch) {
      const r = rMatch ? parseInt(rMatch[1]) : color.r
      const g = gMatch ? parseInt(gMatch[1]) : color.g
      const b = bMatch ? parseInt(bMatch[1]) : color.b

      if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
        setColor({ r, g, b })
        setInputR(r.toString())
        setInputG(g.toString())
        setInputB(b.toString())
      }
    }
  }

  // Handle device connection status
  useEffect(() => {
    setIsConnected(!!device)
    if (device) {
      device.programOutput.onData((data: string | Buffer | Uint8Array) => {
        parseColorData(data.toString())
      })
    }
  }, [device])

  // Send color data to device
  const sendColorData = () => {
    if (!device) return

    const msg = `${rKey}:${color.r};${gKey}:${color.g};${bKey}:${color.b}\n`
    try {
      device.programInput.write(Buffer.from(msg))
      enqueueSnackbar('Color data sent', { variant: 'success' })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error sending color data'
      enqueueSnackbar(errorMessage, { variant: 'error' })
    }
  }

  // Handle RGB input changes
  const handleRChange = (value: string) => {
    setInputR(value)
    const num = parseInt(value)
    if (!isNaN(num) && num >= 0 && num <= 255) {
      setColor(prev => ({ ...prev, r: num }))
    }
  }

  const handleGChange = (value: string) => {
    setInputG(value)
    const num = parseInt(value)
    if (!isNaN(num) && num >= 0 && num <= 255) {
      setColor(prev => ({ ...prev, g: num }))
    }
  }

  const handleBChange = (value: string) => {
    setInputB(value)
    const num = parseInt(value)
    if (!isNaN(num) && num >= 0 && num <= 255) {
      setColor(prev => ({ ...prev, b: num }))
    }
  }

  const rgbColor = `rgb(${color.r}, ${color.g}, ${color.b})`

  if (!isConnected) {
    return (
      <Paper
        sx={{
          p: 4,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          boxShadow: theme.shadows[3],
        }}
      >
        <Alert
          severity="info"
          icon={<ColorLensIcon />}
          sx={{
            fontSize: '1.1rem',
            '& .MuiAlert-message': {
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          Connect to a device to use the color display
        </Alert>
      </Paper>
    )
  }

  return (
    <Paper
      sx={{
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
        borderRadius: 2,
        boxShadow: theme.shadows[4],
      }}
    >
      <Typography variant="h5" gutterBottom>
        Color Display
      </Typography>

      {/* Key Configuration */}
      <Box sx={{ marginBottom: 2, width: '100%', maxWidth: 400 }}>
        <Typography variant="h6" gutterBottom>
          Data Key Configuration
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
          <TextField
            label="Red Key"
            value={rKey}
            onChange={e => setRKey(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label="Green Key"
            value={gKey}
            onChange={e => setGKey(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label="Blue Key"
            value={bKey}
            onChange={e => setBKey(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
        </Box>
      </Box>

      {/* Big Color Circle */}
      <Box
        sx={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          backgroundColor: rgbColor,
          border: `2px solid ${theme.palette.divider}`,
          marginBottom: 3,
          boxShadow: theme.shadows[3],
        }}
      />

      {/* Color Info */}
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        Current Color: {rgbColor}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
        Using keys: {rKey} ({color.r}), {gKey} ({color.g}), {bKey} ({color.b})
      </Typography>

      {/* RGB Input Controls */}
      <Box sx={{ display: 'flex', gap: 2, maxWidth: 400, marginBottom: 2 }}>
        <TextField
          label="R"
          type="number"
          value={inputR}
          onChange={e => handleRChange(e.target.value)}
          inputProps={{ min: 0, max: 255 }}
          size="small"
          sx={{ flex: 1 }}
        />
        <TextField
          label="G"
          type="number"
          value={inputG}
          onChange={e => handleGChange(e.target.value)}
          inputProps={{ min: 0, max: 255 }}
          size="small"
          sx={{ flex: 1 }}
        />
        <TextField
          label="B"
          type="number"
          value={inputB}
          onChange={e => handleBChange(e.target.value)}
          inputProps={{ min: 0, max: 255 }}
          size="small"
          sx={{ flex: 1 }}
        />
      </Box>

      {/* Send Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={sendColorData}
        startIcon={<ColorLensIcon />}
      >
        Send Color
      </Button>
    </Paper>
  )
}
