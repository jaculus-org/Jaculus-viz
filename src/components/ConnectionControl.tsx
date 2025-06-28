import { useDevice } from '@/context/device/useDevice'
import { WebSerialStream } from '@/jac/jac-impl/WebSerialStream.ts'
import { JacDevice } from '@/jac/jac-tools/device/jacDevice.ts'
import { Bluetooth, Power, PowerSettingsNew, Usb } from '@mui/icons-material'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import type { FC } from 'react'
import { useState } from 'react'

type ConnectionType = 'serial' | 'ble'

export interface ConnectionControlProps {
  onConnectionChange?: (connected: boolean) => void
}

const ConnectionControl: FC<ConnectionControlProps> = ({ onConnectionChange }) => {
  const { setNewDevice, disconnectDevice, device } = useDevice()
  const { enqueueSnackbar } = useSnackbar()
  const [connectionType, setConnectionType] = useState<ConnectionType>('serial')
  const [isConnecting, setIsConnecting] = useState(false)

  const connectSerial = async () => {
    try {
      setIsConnecting(true)

      if (!navigator.serial) {
        throw new Error('Web Serial API is not supported in this browser')
      }

      const port = await navigator.serial.requestPort()
      await port.open({ baudRate: 921600 })

      const stream = new WebSerialStream(port)
      const jacDevice = new JacDevice(stream)

      setNewDevice(jacDevice)
      onConnectionChange?.(true)
      enqueueSnackbar('Successfully connected via Serial', { variant: 'success' })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to connect via Serial'
      enqueueSnackbar(errorMessage, { variant: 'error' })
      console.error('Serial connection error:', e)
    } finally {
      setIsConnecting(false)
    }
  }

  const connectBLE = async () => {
    try {
      setIsConnecting(true)

      // TODO: Implement BLE connection
      throw new Error('Bluetooth connection is not yet implemented')
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to connect via Bluetooth'
      enqueueSnackbar(errorMessage, { variant: 'error' })
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
    </Box>
  )
}

export default ConnectionControl
