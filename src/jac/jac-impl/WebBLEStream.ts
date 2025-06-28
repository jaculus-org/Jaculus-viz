import { Buffer } from 'buffer'
import { BaseStream } from './BaseStream.ts'

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

export class WebBLEStream extends BaseStream {
  private device: BluetoothDevice
  private server: BluetoothRemoteGATTServer | null = null
  private service: BluetoothRemoteGATTService | null = null
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null

  constructor(device: BluetoothDevice) {
    super()
    this.device = device
    // Initialize after setting up properties
    this.initialize().catch(error => {
      console.error('WebBLEStream initialization failed:', error)
    })
  }

  protected async initializeConnection(): Promise<void> {
    try {
      console.log('WebBLEStream initializeConnection called')
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
      console.log('WebBLEStream initialized successfully')
    } catch (error) {
      console.error('WebBLEStream initialization error:', error)
      throw new WebBLEError(`Cannot initialize BLE connection: ${error}`)
    }
  }

  protected writeToTransport(data: Uint8Array): void {
    if (!this.characteristic || !this.isInitialized) {
      throw new WebBLEError('BLE characteristic not available or not initialized')
    }
    this.characteristic.writeValue(data)
  }

  protected async cleanupTransport(): Promise<void> {
    try {
      if (this.device && this.device.gatt && this.device.gatt.connected) {
        await this.device.gatt.disconnect()
      }
      this.cleanup()
    } catch (error) {
      console.error('Error during BLE cleanup:', error)
    }
  }

  private onDisconnected(): void {
    this.handleEnd()
  }

  private onDataReceived(event: Event): void {
    console.log('WebBLEStream onDataReceived called')
    const target = event.target as BluetoothRemoteGATTCharacteristic
    const { value } = target
    if (value) {
      console.log('WebBLEStream received data:', value)
      this.handleData(Buffer.from(value.buffer))
    }
  }

  private cleanup(): void {
    this.characteristic = null
    this.service = null
    this.server = null
  }
}
