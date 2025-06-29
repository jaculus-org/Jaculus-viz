import type { JacDevice } from '@/jac/jac-tools/device/jacDevice'
import { delay, withTimeout } from '@/utils/timeoutUtils.ts'

export interface DeviceRestartOptions {
  /** Timeout for lock operation in milliseconds (default: 3000) */
  lockTimeout?: number
  /** Timeout for stop operation in milliseconds (default: 3000) */
  stopTimeout?: number
  /** Timeout for start operation in milliseconds (default: 5000) */
  startTimeout?: number
  /** Timeout for unlock operation in milliseconds (default: 3000) */
  unlockTimeout?: number
  /** Delay between stop and start operations in milliseconds (default: 500) */
  restartDelay?: number
  /** Script to start after restart (default: 'index.js') */
  startScript?: string
}

export interface DeviceRestartResult {
  success: boolean
  message: string
  steps: {
    lock: boolean
    stop: boolean
    start: boolean
    unlock: boolean
  }
}

/**
 * Restarts a JAC device with robust error handling and configurable timeouts
 * @param device - The JAC device to restart
 * @param options - Configuration options for the restart operation
 * @returns Promise<DeviceRestartResult> - Result of the restart operation
 */
export const restartDevice = async (
  device: JacDevice,
  options: DeviceRestartOptions = {}
): Promise<DeviceRestartResult> => {
  const {
    lockTimeout = 3000,
    stopTimeout = 3000,
    startTimeout = 5000,
    unlockTimeout = 3000,
    restartDelay = 500,
    startScript = 'index.js',
  } = options

  const result: DeviceRestartResult = {
    success: false,
    message: '',
    steps: {
      lock: false,
      stop: false,
      start: false,
      unlock: false,
    },
  }

  try {
    // Lock device
    try {
      await withTimeout(device.controller.lock(), lockTimeout)
      result.steps.lock = true
    } catch (err) {
      console.warn('Lock timeout, continuing anyway:', err)
      // Continue even if lock fails - device might already be locked
    }

    // Stop device
    try {
      await withTimeout(device.controller.stop(), stopTimeout)
      result.steps.stop = true
    } catch (err) {
      console.warn('Stop timeout:', err)
    }

    await delay(restartDelay)

    // Start device
    try {
      await withTimeout(device.controller.start(startScript), startTimeout)
      result.steps.start = true
      result.success = true
      result.message = 'Device restarted successfully'
    } catch (err) {
      console.warn('Start timeout:', err)
      result.message = 'Device restart may have failed - check device status'
    }

    // Unlock device
    try {
      await withTimeout(device.controller.unlock(), unlockTimeout)
      result.steps.unlock = true
    } catch (err) {
      console.warn('Unlock timeout:', err)
    }

    return result
  } catch (error) {
    console.error('Restart error:', error)
    result.message = 'Error during device restart'

    try {
      await withTimeout(device.controller.unlock(), 2000)
      result.steps.unlock = true
    } catch {
      // intentionally empty: unlock failure is non-fatal here
    }

    return result
  }
}
