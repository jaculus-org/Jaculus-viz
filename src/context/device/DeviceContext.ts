import type { JacDevice } from 'jaculus-tools/dist/src/device/jacDevice.js'
import { createContext } from 'react'

export interface DeviceContextType {
  device: JacDevice | null
  setNewDevice: (device: JacDevice | null) => void
  disconnectDevice: () => void
  connected: boolean
  setConnected: (connected: boolean) => void
}

export const DeviceContext = createContext<DeviceContextType | null>(null)
