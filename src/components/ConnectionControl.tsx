import { useDevice } from '@/context/device/useDevice'
import {
  StreamFactory,
  type ConnectionType as StreamConnectionType,
} from '@/jac/jac-impl/StreamFactory.ts'
import { JacDevice } from '@/jac/jac-tools/device/jacDevice.ts'
import { Bluetooth, Power, PowerSettingsNew, Usb } from '@mui/icons-material'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

type ConnectionType = StreamConnectionType

export interface ConnectionControlProps {
  onConnectionChange?: (connected: boolean) => void
}

const ConnectionControl: FC<ConnectionControlProps> = ({ onConnectionChange }) => {
  const { setNewDevice, disconnectDevice, device } = useDevice()
  const { enqueueSnackbar } = useSnackbar()

  const [connectionType, setConnectionType] = useState<ConnectionType>('serial')
  const [isConnecting, setIsConnecting] = useState(false)
  const [supportedTypes, setSupportedTypes] = useState<ConnectionType[]>([])

  // Load connection type from URL parameter and update URL when changed
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

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <FormControl size="small" sx={{ minWidth: 120 }} disabled={!!device}>
        <InputLabel>Connection</InputLabel>
        <Select
          value={connectionType}
          label="Connection"
          onChange={e => handleConnectionTypeChange(e.target.value as ConnectionType)}
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
                <Typography variant="body2">Bluetooth</Typography>
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

      {device ? (
        <Button
          variant="contained"
          color="error"
          onClick={handleDisconnect}
          startIcon={<Power />}
          size="small"
        >
          Disconnect
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleConnect}
          disabled={isConnecting || supportedTypes.length === 0}
          startIcon={<PowerSettingsNew />}
          size="small"
        >
          {isConnecting ? 'Connecting...' : 'Connect'}
        </Button>
      )}
    </Box>
  )
}

export default ConnectionControl
