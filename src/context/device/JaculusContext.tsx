import type { JacDevice } from '@/jac/jac-tools/device/jacDevice.ts'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { DeviceContext } from './DeviceContext'

interface DeviceProps {
  children: ReactNode
}

export default function DeviceProvider({ children }: DeviceProps) {
  const [device, setDevice] = useState<JacDevice | null>(null)
  const [connected, setConnected] = useState<boolean>(false)

  useEffect(() => {
    console.log('DeviceProvider: ', device)
    setConnected(!!device)
  }, [device])

  const setNewDevice = (newDevice: JacDevice | null) => {
    if (device) {
      device.destroy()
    }
    setDevice(newDevice)
    setConnected(!!newDevice)
  }

  const disconnectDevice = () => {
    if (device) {
      device.destroy()
    }
    setDevice(null)
    setConnected(false)
  }

  return (
    <DeviceContext.Provider
      value={{
        device: device,
        setNewDevice: setNewDevice,
        disconnectDevice: disconnectDevice,
        connected: connected,
        setConnected: setConnected,
      }}
    >
      {children}
    </DeviceContext.Provider>
  )
}
