import type { JacDevice } from '@/jac/jac-tools/device/jacDevice.ts'
import { useContext } from 'react'
import { DeviceDataContext } from './DeviceDataContext'

export function useDeviceData(device: JacDevice | null) {
  const context = useContext(DeviceDataContext)

  if (!context) {
    throw new Error('useDeviceData must be used within a DeviceDataProvider')
  }

  return {
    ...context,
    device,
  }
}
