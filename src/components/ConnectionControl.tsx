import type { FC } from 'react'
import { useState } from 'react'
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material'
import { Bluetooth, Usb, PowerSettingsNew, Power } from '@mui/icons-material'
import { useDevice } from '@/context/device/useDevice'
import { JacDevice } from '@/jac/jac-tools/device/jacDevice.ts'
import { WebSerialStream } from '@/jac/jac-impl/WebSerialStream.ts'

type ConnectionType = 'serial' | 'ble'

export interface ConnectionControlProps {
  onConnectionChange?: (connected: boolean) => void
}

const ConnectionControl: FC<ConnectionControlProps> = ({ onConnectionChange }) => {
  const { setNewDevice, disconnectDevice, device } = useDevice()
  const [connectionType, setConnectionType] = useState<ConnectionType>('serial')
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectSerial = async () => {
    try {
      setIsConnecting(true)
      setError(null)

      if (!navigator.serial) {
        throw new Error('Web Serial API is not supported in this browser')
      }

      const port = await navigator.serial.requestPort()
      await port.open({ baudRate: 921600 })

      const stream = new WebSerialStream(port)
      const jacDevice = new JacDevice(stream)

      setNewDevice(jacDevice)
      onConnectionChange?.(true)
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to connect via Serial'
      setError(errorMessage)
      console.error('Serial connection error:', e)
    } finally {
      setIsConnecting(false)
    }
  }

  const connectBLE = async () => {
    try {
      setIsConnecting(true)
      setError(null)

      // TODO: Implement BLE connection
      throw new Error('Bluetooth connection is not yet implemented')
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to connect via Bluetooth'
      setError(errorMessage)
      console.error('BLE connection error:', e)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleConnect = () => {
    if (connectionType === 'serial') {
      connectSerial()
    } else {
      connectBLE()
    }
  }

  const handleDisconnect = () => {
    try {
      disconnectDevice()
      onConnectionChange?.(false)
    } catch (e) {
      console.error('Disconnect error:', e)
    }
  }

  const handleCloseError = () => {
    setError(null)
  }

  const getConnectionIcon = () => {
    if (connectionType === 'serial') {
      return <Usb />
    }
    return <Bluetooth />
  }

  const getConnectionStatus = () => {
    if (device) {
      return (
        <Chip
          icon={getConnectionIcon()}
          label="Connected"
          color="success"
          variant="filled"
          size="small"
        />
      )
    }
    return (
      <Chip
        icon={getConnectionIcon()}
        label="Disconnected"
        color="default"
        variant="outlined"
        size="small"
      />
    )
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <FormControl size="small" sx={{ minWidth: 120 }} disabled={!!device}>
        <InputLabel>Connection</InputLabel>
        <Select
          value={connectionType}
          label="Connection"
          onChange={e => setConnectionType(e.target.value as ConnectionType)}
        >
          <MenuItem value="serial">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Usb fontSize="small" />
              <Typography variant="body2">Serial</Typography>
            </Box>
          </MenuItem>
          <MenuItem value="ble">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Bluetooth fontSize="small" />
              <Typography variant="body2">Bluetooth</Typography>
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      {getConnectionStatus()}

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
          disabled={isConnecting}
          startIcon={<PowerSettingsNew />}
          size="small"
        >
          {isConnecting ? 'Connecting...' : 'Connect'}
        </Button>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ConnectionControl
