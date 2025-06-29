import { useDevice } from '@/context/device/useDevice'
import { useDeviceData } from '@/context/deviceData/useDeviceData'
import {
  StreamFactory,
  type ConnectionType as StreamConnectionType,
} from '@/jac/jac-impl/StreamFactory.ts'
import { JacDevice } from '@/jac/jac-tools/device/jacDevice.ts'
import {
  Bluetooth,
  Pause,
  PlayArrow,
  Power,
  PowerSettingsNew,
  Refresh,
  Usb,
} from '@mui/icons-material'
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

// Helper function for timeout handling
const withTimeout = (promise: Promise<any>, timeoutMs: number = 5000): Promise<any> => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)),
  ])
}

type ConnectionType = StreamConnectionType

export interface ConnectionControlProps {
  onConnectionChange?: (connected: boolean) => void
}

const ConnectionControl: FC<ConnectionControlProps> = ({ onConnectionChange }) => {
  const { setNewDevice, disconnectDevice, device } = useDevice()
  const deviceData = useDeviceData(device)
  const { enqueueSnackbar } = useSnackbar()

  const [connectionType, setConnectionType] = useState<ConnectionType>('serial')
  const [isConnecting, setIsConnecting] = useState(false)
  const [supportedTypes, setSupportedTypes] = useState<ConnectionType[]>([])

  // ...existing useEffect code...
  useEffect(() => {
    const types = StreamFactory.getSupportedTypes()
    setSupportedTypes(types)

    // Get connection type from URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    const urlConnectionType = urlParams.get('connectionType') as ConnectionType

    if (urlConnectionType && types.includes(urlConnectionType)) {
      setConnectionType(urlConnectionType)
    } else if (types.length > 0) {
      // Set default connection type to the first supported one
      const defaultType = types[0]
      setConnectionType(defaultType)
      // Update URL with default connection type
      updateURLParameter('connectionType', defaultType)
    }
  }, [])

  // Helper function to update URL parameter
  const updateURLParameter = (key: string, value: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set(key, value)
    window.history.replaceState({}, '', url.toString())
  }

  // Update URL when connection type changes
  const handleConnectionTypeChange = (newConnectionType: ConnectionType) => {
    setConnectionType(newConnectionType)
    updateURLParameter('connectionType', newConnectionType)
  }

  const connectDevice = async () => {
    try {
      setIsConnecting(true)

      const stream = await StreamFactory.createStream(connectionType)
      const jacDevice = new JacDevice(stream)

      setNewDevice(jacDevice)
      onConnectionChange?.(true)
      enqueueSnackbar(`Successfully connected via ${connectionType.toUpperCase()}`, {
        variant: 'success',
      })
    } catch (e) {
      // Error is already handled by StreamFactory, just log and cleanup
      console.error(`${connectionType} connection error:`, e)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleConnect = () => {
    connectDevice()
  }

  const handleDisconnect = () => {
    try {
      disconnectDevice()
      onConnectionChange?.(false)
      enqueueSnackbar('Disconnected successfully', { variant: 'info' })
    } catch (e) {
      console.error('Disconnect error:', e)
      enqueueSnackbar('Error during disconnect', { variant: 'error' })
    }
  }

  const handleRestart = async () => {
    if (!device) {
      return
    }

    try {
      enqueueSnackbar('Restarting device...', { variant: 'info' })

      // Step 1: Lock device (with shorter timeout)
      try {
        await withTimeout(device.controller.lock(), 3000)
      } catch (err) {
        console.warn('Lock timeout, continuing anyway:', err)
        // Continue even if lock fails - device might already be locked
      }

      // Step 2: Stop device
      try {
        await withTimeout(device.controller.stop(), 3000)
      } catch (err) {
        console.warn('Stop timeout:', err)
        // Continue even if stop fails
      }

      // Wait a moment before starting
      await new Promise(resolve => setTimeout(resolve, 500))

      // Step 3: Start device
      try {
        await withTimeout(device.controller.start('index.js'), 5000)
        enqueueSnackbar('Device restarted successfully', { variant: 'success' })
      } catch (err) {
        console.warn('Start timeout:', err)
        enqueueSnackbar('Device restart may have failed - check device status', {
          variant: 'warning',
        })
      }

      // Step 4: Unlock device (always try to unlock)
      try {
        await withTimeout(device.controller.unlock(), 3000)
      } catch (err) {
        console.warn('Unlock timeout:', err)
        // Device might auto-unlock, so this isn't critical
      }
    } catch (error) {
      console.error('Restart error:', error)
      enqueueSnackbar('Error during device restart', { variant: 'error' })

      // Try to unlock as cleanup
      try {
        await withTimeout(device.controller.unlock(), 2000)
      } catch {
        // Ignore unlock errors during cleanup
      }
    }
  }

  const getConnectionIcon = () => {
    switch (connectionType) {
      case 'ble':
        return <Bluetooth fontSize="small" />
      case 'serial':
      default:
        return <Usb fontSize="small" />
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {device ? (
        // When connected: Show connection icon and control buttons
        <>
          <Tooltip title={`Connected via ${connectionType.toUpperCase()}`}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1,
                borderRadius: 1,
                backgroundColor: theme =>
                  theme.palette.mode === 'dark' ? 'success.dark' : 'success.main',
                color: theme => (theme.palette.mode === 'dark' ? 'success.contrastText' : 'white'),
                '& svg': {
                  color: 'inherit',
                },
              }}
            >
              {getConnectionIcon()}
            </Box>
          </Tooltip>

          <Tooltip title={deviceData.isPaused ? 'Resume data processing' : 'Pause data processing'}>
            <IconButton
              size="small"
              onClick={() => deviceData.setPaused(!deviceData.isPaused)}
              sx={{
                color: theme =>
                  deviceData.isPaused
                    ? theme.palette.mode === 'dark'
                      ? theme.palette.warning.light
                      : theme.palette.warning.dark
                    : theme.palette.mode === 'dark'
                      ? theme.palette.success.light
                      : theme.palette.success.dark,
                backgroundColor: theme =>
                  deviceData.isPaused
                    ? theme.palette.mode === 'dark'
                      ? 'rgba(255, 152, 0, 0.1)'
                      : 'rgba(255, 152, 0, 0.08)'
                    : theme.palette.mode === 'dark'
                      ? 'rgba(76, 175, 80, 0.1)'
                      : 'rgba(76, 175, 80, 0.08)',
                border: theme =>
                  `1px solid ${
                    deviceData.isPaused
                      ? theme.palette.mode === 'dark'
                        ? theme.palette.warning.dark
                        : theme.palette.warning.light
                      : theme.palette.mode === 'dark'
                        ? theme.palette.success.dark
                        : theme.palette.success.light
                  }`,
                '&:hover': {
                  backgroundColor: theme =>
                    deviceData.isPaused
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(255, 152, 0, 0.2)'
                        : 'rgba(255, 152, 0, 0.12)'
                      : theme.palette.mode === 'dark'
                        ? 'rgba(76, 175, 80, 0.2)'
                        : 'rgba(76, 175, 80, 0.12)',
                  color: theme =>
                    deviceData.isPaused ? theme.palette.warning.main : theme.palette.success.main,
                  borderColor: theme =>
                    deviceData.isPaused ? theme.palette.warning.main : theme.palette.success.main,
                },
              }}
            >
              {deviceData.isPaused ? <PlayArrow /> : <Pause />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Restart device">
            <IconButton
              size="small"
              onClick={handleRestart}
              sx={{
                color: theme =>
                  theme.palette.mode === 'dark'
                    ? theme.palette.info.light
                    : theme.palette.info.dark,
                backgroundColor: theme =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(33, 150, 243, 0.1)'
                    : 'rgba(33, 150, 243, 0.08)',
                border: theme =>
                  `1px solid ${
                    theme.palette.mode === 'dark'
                      ? theme.palette.info.dark
                      : theme.palette.info.light
                  }`,
                '&:hover': {
                  backgroundColor: theme =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(33, 150, 243, 0.2)'
                      : 'rgba(33, 150, 243, 0.12)',
                  color: theme => theme.palette.info.main,
                  borderColor: theme => theme.palette.info.main,
                },
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            color="error"
            onClick={handleDisconnect}
            startIcon={<Power />}
            size="small"
            sx={{
              '&:hover': {
                backgroundColor: 'error.dark',
              },
            }}
          >
            Disconnect
          </Button>
        </>
      ) : (
        // When disconnected: Show connection dropdown and connect button
        <>
          <FormControl
            size="small"
            sx={{
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
                color: 'text.primary',
                '& fieldset': {
                  borderColor: 'divider',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'text.secondary',
                '&.Mui-focused': {
                  color: 'primary.main',
                },
              },
              '& .MuiSelect-icon': {
                color: 'text.secondary',
              },
            }}
          >
            <InputLabel>Connection</InputLabel>
            <Select
              value={connectionType}
              label="Connection"
              onChange={e => handleConnectionTypeChange(e.target.value as ConnectionType)}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'background.paper',
                    border: theme => `1px solid ${theme.palette.divider}`,
                    '& .MuiMenuItem-root': {
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'action.selected',
                        '&:hover': {
                          backgroundColor: 'action.selected',
                        },
                      },
                    },
                  },
                },
              }}
            >
              {supportedTypes.includes('serial') && (
                <MenuItem value="serial">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Usb fontSize="small" />
                    <Typography variant="body2">Serial</Typography>
                  </Box>
                </MenuItem>
              )}
              {supportedTypes.includes('ble') && (
                <MenuItem value="ble">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Bluetooth fontSize="small" />
                    <Typography variant="body2">BLE</Typography>
                  </Box>
                </MenuItem>
              )}
              {supportedTypes.length === 0 && (
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    No supported connection types
                  </Typography>
                </MenuItem>
              )}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleConnect}
            disabled={isConnecting || supportedTypes.length === 0}
            startIcon={<PowerSettingsNew />}
            size="small"
            sx={{
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              '&:disabled': {
                backgroundColor: 'action.disabledBackground',
                color: 'action.disabled',
              },
            }}
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
        </>
      )}
    </Box>
  )
}

export default ConnectionControl
