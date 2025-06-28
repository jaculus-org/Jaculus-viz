import { Buffer } from 'buffer'
import { BaseStream } from './BaseStream.ts'

class WebSerialError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WebSerialError'
  }
}

export class WebSerialStream extends BaseStream {
  private port: SerialPort
  private reader!: ReadableStreamDefaultReader<Uint8Array>
  private writer!: WritableStreamDefaultWriter<Uint8Array>

  constructor(port: SerialPort) {
    super()
    this.port = port
    // Initialize after setting up properties
    this.initialize().catch(error => {
      console.error('WebSerialStream initialization failed:', error)
    })
  }

  protected async initializeConnection(): Promise<void> {
    console.log('WebSerialStream initializeConnection called')
    const reader = this.port.readable?.getReader()
    if (!reader) throw new WebSerialError('Cannot open reader')

    const writer = this.port.writable?.getWriter()
    if (!writer) throw new WebSerialError('Cannot open writer')

    this.reader = reader
    this.writer = writer

    this.isInitialized = true
    console.log('WebSerialStream initialized successfully')

    // Start the read routine
    this.startReadRoutine()
  }

  protected writeToTransport(data: Uint8Array): void {
    this.writer.write(data)
  }

  protected async cleanupTransport(): Promise<void> {
    await this.reader.cancel()
    await this.writer.abort()
    await this.port.close()
  }

  private startReadRoutine(): void {
    console.log('WebSerialStream startReadRoutine called')
    const readRoutine = async () => {
      try {
        console.log('WebSerialStream read routine started')
        while (this.isInitialized) {
          const { value, done } = await this.reader.read()
          if (done) {
            this.reader.releaseLock()
            this.handleEnd()
            break
          } else {
            console.log('WebSerialStream received data:', value)
            this.handleData(Buffer.from(value))
          }
        }
      } catch (error) {
        console.log('WebSerialStream read routine error:', error)
        this.handleError(error as Error)
      }
    }
    void readRoutine()
  }
}
