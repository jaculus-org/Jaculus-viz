import type { Duplex } from '@/jac/jac-tools/link/stream.ts'
import { errorNotificationSystem } from '@/utils/errorNotification'
import { NAME_PREFIX, SERVICE_UUID, WebBLEStream } from './WebBLEStream.ts'
import { WebSerialStream } from './WebSerialStream.ts'

export type ConnectionType = 'serial' | 'ble'

export interface ConnectionOptions {
  serial?: {
    baudRate?: number
    filters?: SerialPortFilter[]
  }
  ble?: {
    serviceUUID?: number
    characteristicUUID?: number
    filters?: BluetoothLEScanFilter[]
  }
}

class StreamFactoryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'StreamFactoryError'
  }
}

export class StreamFactory {
  /**
   * Creates a connection stream based on the specified type
   */
  static async createStream(
    type: ConnectionType,
    options: ConnectionOptions = {}
  ): Promise<Duplex> {
    switch (type) {
      case 'serial':
        return this.createSerialStream(options.serial)
      case 'ble':
        return this.createBLEStream(options.ble)
      default:
        throw new StreamFactoryError(`Unsupported connection type: ${type}`)
    }
  }

  /**
   * Creates a Serial connection stream
   */
  private static async createSerialStream(options?: ConnectionOptions['serial']): Promise<Duplex> {
    if (!navigator.serial) {
      throw new StreamFactoryError('Web Serial API is not supported in this browser')
    }

    try {
      const port = await navigator.serial.requestPort({
        filters: options?.filters || [],
      })

      await port.open({
        baudRate: options?.baudRate || 921600,
      })

      return new WebSerialStream(port)
    } catch (error) {
      const errorMessage = `Failed to create Serial stream: ${error}`
      errorNotificationSystem.notifyConnectionError('serial', error as Error)
      throw new StreamFactoryError(errorMessage)
    }
  }

  /**
   * Creates a BLE connection stream
   */
  private static async createBLEStream(options?: ConnectionOptions['ble']): Promise<Duplex> {
    if (!navigator.bluetooth) {
      throw new StreamFactoryError('Web Bluetooth API is not supported in this browser')
    }

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: options?.filters || [{ namePrefix: NAME_PREFIX }],
        optionalServices: [options?.serviceUUID || SERVICE_UUID],
      })

      return new WebBLEStream(device)
    } catch (error) {
      const errorMessage = `Failed to create BLE stream: ${error}`
      errorNotificationSystem.notifyConnectionError('ble', error as Error)
      throw new StreamFactoryError(errorMessage)
    }
  }

  /**
   * Check if a connection type is supported in the current browser
   */
  static isSupported(type: ConnectionType): boolean {
    switch (type) {
      case 'serial':
        return 'serial' in navigator
      case 'ble':
        return 'bluetooth' in navigator
      default:
        return false
    }
  }

  /**
   * Get all supported connection types for the current browser
   */
  static getSupportedTypes(): ConnectionType[] {
    const types: ConnectionType[] = []
    if (this.isSupported('serial')) types.push('serial')
    if (this.isSupported('ble')) types.push('ble')
    return types
  }
}
