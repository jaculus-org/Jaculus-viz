import type { Duplex } from '@/jac/jac-tools/link/stream.ts'
import { Buffer } from 'buffer'

class WebBLEError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WebBLEError'
  }
}

// BLE Service and Characteristic UUIDs (matching ESP32 implementation)
export const SERVICE_UUID = 0x00ff
export const CHARACTERISTIC_UUID = 0xff01
export const NAME_PREFIX = 'ESP32'

export class WebBLEStream implements Duplex {
  private callbacks: {
    data?: (data: Buffer) => void
    error?: (err: Error) => void
    end?: () => void
  } = {}

  private device: BluetoothDevice
  private server: BluetoothRemoteGATTServer | null = null
  private service: BluetoothRemoteGATTService | null = null
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null
  private isInitialized: boolean = false

  constructor(device: BluetoothDevice) {
    this.device = device
    this.initializeConnection().catch(error => {
      if (this.callbacks['error']) {
        this.callbacks['error'](error)
      }
    })
  }

  private async initializeConnection(): Promise<void> {
    try {
      // Add disconnect event listener
      this.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this))

      // Connect to GATT server
      this.server = await this.device.gatt!.connect()

      // Get service
      this.service = await this.server.getPrimaryService(SERVICE_UUID)

      // Get characteristic
      this.characteristic = await this.service.getCharacteristic(CHARACTERISTIC_UUID)

      // Enable notifications
      await this.characteristic.startNotifications()
      this.characteristic.addEventListener(
        'characteristicvaluechanged',
        this.onDataReceived.bind(this)
      )

      this.isInitialized = true
    } catch (error) {
      if (this.callbacks['error']) {
        this.callbacks['error'](error as Error)
      }
      throw new WebBLEError(`Cannot initialize BLE connection: ${error}`)
    }
  }

  private onDisconnected(): void {
    this.isInitialized = false
    if (this.callbacks['end']) {
      this.callbacks['end']()
    }
    this.cleanup()
  }

  private onDataReceived(event: Event): void {
    const target = event.target as BluetoothRemoteGATTCharacteristic
    const { value } = target
    if (value && this.callbacks['data']) {
      this.callbacks['data'](Buffer.from(value.buffer))
    }
  }

  private cleanup(): void {
    this.characteristic = null
    this.service = null
    this.server = null
  }

  public put(c: number): void {
    this.write(Buffer.from([c]))
  }

  public write(buf: Buffer): void {
    if (!this.characteristic || !this.isInitialized) {
      throw new WebBLEError('BLE characteristic not available or not initialized')
    }

    try {
      // Convert Buffer to Uint8Array
      const uint8Array = new Uint8Array(buf)
      this.characteristic.writeValue(uint8Array)
    } catch (error) {
      if (this.callbacks['error']) {
        this.callbacks['error'](error as Error)
      }
    }
  }

  public onData(callback?: (data: Buffer) => void): void {
    this.callbacks['data'] = callback
  }

  public onEnd(callback?: () => void): void {
    this.callbacks['end'] = callback
  }

  public onError(callback?: (err: Error) => void): void {
    this.callbacks['error'] = callback
  }

  public destroy(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.callbacks['end']) {
        const end = this.callbacks['end']
        this.callbacks['end'] = () => {
          end()
          resolve()
        }
      } else {
        this.callbacks['end'] = () => {
          resolve()
        }
      }
      if (this.callbacks['error']) {
        const error = this.callbacks['error']
        this.callbacks['error'] = (err: Error) => {
          error(err)
          reject(err)
        }
      } else {
        this.callbacks['error'] = (err: Error) => {
          reject(err)
        }
      }

      void (async () => {
        try {
          if (this.device && this.device.gatt && this.device.gatt.connected) {
            await this.device.gatt.disconnect()
          }
          this.cleanup()
        } catch (error) {
          console.error('Error during BLE cleanup:', error)
        }
      })()
    })
  }
}
