import { createContext } from 'react'
import type { JacDevice } from '@/jac-tools/device/jacDevice.ts'

export interface DeviceContextType {
  device: JacDevice | null
  setNewDevice: (device: JacDevice | null) => void
  disconnectDevice: () => void
  connected: boolean
  setConnected: (connected: boolean) => void
}

export const DeviceContext = createContext<DeviceContextType | null>(null)
