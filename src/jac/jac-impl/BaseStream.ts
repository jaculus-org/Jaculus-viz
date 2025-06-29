import type { Duplex } from '@/jac/jac-tools/link/stream.ts'
import { errorNotificationSystem } from '@/utils/errorNotification'
import { Buffer } from 'buffer'

export abstract class BaseStream implements Duplex {
  protected callbacks: {
    data?: (data: Buffer) => void
    error?: (err: Error) => void
    end?: () => void
  } = {}

  protected isInitialized: boolean = false

  /**
   * Initialize the stream - must be called by subclasses after they're ready
   */
  protected async initialize(): Promise<void> {
    try {
      await this.initializeConnection()
    } catch (error) {
      errorNotificationSystem.notifyInitializationError('connection stream', error as Error)
      this.handleError(error as Error)
    }
  }

  /**
   * Abstract method to initialize the connection
   */
  protected abstract initializeConnection(): Promise<void>

  /**
   * Abstract method to write data to the underlying transport
   */
  protected abstract writeToTransport(data: Uint8Array): Promise<void> | void

  /**
   * Abstract method to cleanup transport-specific resources
   */
  protected abstract cleanupTransport(): Promise<void> | void

  /**
   * Handle incoming data from the transport layer
   */
  protected handleData(data: Buffer): void {
    if (this.callbacks['data']) {
      this.callbacks['data'](data)
    }
  }

  /**
   * Handle connection end
   */
  protected handleEnd(): void {
    this.isInitialized = false
    if (this.callbacks['end']) {
      this.callbacks['end']()
    }
  }

  /**
   * Handle errors
   */
  protected handleError(error: Error): void {
    if (this.callbacks['error']) {
      this.callbacks['error'](error)
    }
  }

  public put(c: number): void {
    this.write(Buffer.from([c]))
  }

  public write(buf: Buffer): void {
    if (!this.isInitialized) {
      throw new Error('Stream not initialized')
    }

    try {
      const uint8Array = new Uint8Array(buf)
      this.writeToTransport(uint8Array)
    } catch (error) {
      this.handleError(error as Error)
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
      // Set up promise resolution through callbacks
      if (this.callbacks['end']) {
        const originalEnd = this.callbacks['end']
        this.callbacks['end'] = () => {
          originalEnd()
          resolve()
        }
      } else {
        this.callbacks['end'] = () => {
          resolve()
        }
      }

      if (this.callbacks['error']) {
        const originalError = this.callbacks['error']
        this.callbacks['error'] = (err: Error) => {
          originalError(err)
          reject(err)
        }
      } else {
        this.callbacks['error'] = (err: Error) => {
          reject(err)
        }
      }

      // Perform cleanup
      void (async () => {
        try {
          await this.cleanupTransport()
          this.handleEnd()
        } catch (error) {
          console.error('Error during cleanup:', error)
          this.handleError(error as Error)
        }
      })()
    })
  }
}
