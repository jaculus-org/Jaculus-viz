import { JacDevice } from 'jaculus-tools/dist/src/device/jacDevice.js'
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
  }, [device])

  const setNewDevice = (newDevice: JacDevice | null) => {
    if (device) {
      device.destroy()
    }
    setDevice(newDevice)
  }

  const disconnectDevice = () => {
    if (device) {
      device.destroy()
    }
    setDevice(null)
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
