import { useDevice } from '@/context/device/useDevice'
import { useDeviceData } from '@/context/deviceData/useDeviceData'
import {
  StreamFactory,
  type ConnectionType as StreamConnectionType,
} from '@/jac/jac-impl/StreamFactory.ts'
import { JacDevice } from '@/jac/jac-tools/device/jacDevice.ts'
import HorizontalStack from '@/ui/box/HorizontalStack'
import ConnectButton from '@/ui/button/ConnectButton'
import ConnectionIcon from '@/ui/button/ConnectionIcon'
import DisconnectButton from '@/ui/button/DisconnectButton'
import PauseResumeButton from '@/ui/button/PauseResumeButton'
import RestartButton from '@/ui/button/RestartButton'
import ConnectionTypeSelect from '@/ui/select/ConnectionTypeSelect'
import { useSnackbar } from 'notistack'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { getURLParameter, updateURLParameter } from '@/utils/urlUtils.ts'
import { restartDevice } from '@/jac/jac-helpers'

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

  useEffect(() => {
    const types = StreamFactory.getSupportedTypes()
    setSupportedTypes(types)

    // Get connection type from URL parameter
    const urlConnectionType = getURLParameter('connectionType') as ConnectionType

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

  // Update URL when connection type changes
  const handleConnectionTypeChange = (newConnectionType: string) => {
    setConnectionType(newConnectionType as ConnectionType)
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

    enqueueSnackbar('Restarting device...', { variant: 'info' })

    const result = await restartDevice(device)

    if (result.success) {
      enqueueSnackbar(result.message, { variant: 'success' })
    } else {
      enqueueSnackbar(result.message, {
        variant: result.steps.start ? 'warning' : 'error',
      })
    }
  }

  return (
    <HorizontalStack>
      {device ? (
        // When connected: Show connection icon and control buttons
        <>
          <ConnectionIcon type={connectionType} />
          <PauseResumeButton
            paused={deviceData.isPaused}
            onClick={() => deviceData.setPaused(!deviceData.isPaused)}
          />
          <RestartButton onClick={handleRestart} />
          <DisconnectButton onClick={handleDisconnect} />
        </>
      ) : (
        // When disconnected: Show connection dropdown and connect button
        <>
          <ConnectionTypeSelect
            value={connectionType}
            supportedTypes={supportedTypes}
            onChange={handleConnectionTypeChange}
          />
          <ConnectButton
            onClick={handleConnect}
            disabled={isConnecting || supportedTypes.length === 0}
            isConnecting={isConnecting}
          />
        </>
      )}
    </HorizontalStack>
  )
}

export default ConnectionControl
