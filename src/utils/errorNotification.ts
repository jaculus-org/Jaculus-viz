import { type SnackbarKey, type VariantType } from 'notistack'

// Global error notification system
class ErrorNotificationSystem {
  private enqueueSnackbar:
    | ((
        message: string,
        options?: { variant?: VariantType; persist?: boolean; autoHideDuration?: number }
      ) => SnackbarKey)
    | null = null

  setEnqueueSnackbar(
    enqueueSnackbar: (
      message: string,
      options?: { variant?: VariantType; persist?: boolean; autoHideDuration?: number }
    ) => SnackbarKey
  ) {
    this.enqueueSnackbar = enqueueSnackbar
  }

  notifyError(message: string, error?: Error) {
    console.error(message, error)

    if (this.enqueueSnackbar) {
      const displayMessage = error ? `${message}: ${error.message}` : message
      this.enqueueSnackbar(displayMessage, {
        variant: 'error',
        autoHideDuration: 8000, // Longer for errors
      })
    }
  }

  notifyWarning(message: string) {
    console.warn(message)

    if (this.enqueueSnackbar) {
      this.enqueueSnackbar(message, {
        variant: 'warning',
        autoHideDuration: 6000,
      })
    }
  }

  notifySuccess(message: string) {
    console.info(message)

    if (this.enqueueSnackbar) {
      this.enqueueSnackbar(message, {
        variant: 'success',
        autoHideDuration: 4000,
      })
    }
  }

  notifyInfo(message: string) {
    console.info(message)

    if (this.enqueueSnackbar) {
      this.enqueueSnackbar(message, {
        variant: 'info',
        autoHideDuration: 4000,
      })
    }
  }

  /**
   * Show connection-related errors with more specific messaging
   */
  notifyConnectionError(type: 'serial' | 'ble', error: Error) {
    const connectionType = type.toUpperCase()
    let userMessage = `${connectionType} connection failed`

    // Provide more user-friendly error messages
    if (error.message.includes('User cancelled')) {
      userMessage = `${connectionType} connection cancelled by user`
    } else if (error.message.includes('not supported')) {
      userMessage = `${connectionType} is not supported in this browser`
    } else if (error.message.includes('Cannot open')) {
      userMessage = `Failed to open ${connectionType} port`
    } else if (error.message.includes('BLE connection')) {
      userMessage = `Bluetooth device connection failed`
    } else if (error.message.includes('Serial stream')) {
      userMessage = `Serial port communication error`
    }

    this.notifyError(userMessage, error)
  }

  /**
   * Show initialization errors with context
   */
  notifyInitializationError(component: string, error: Error) {
    const userMessage = `Failed to initialize ${component}`
    this.notifyError(userMessage, error)
  }
}

export const errorNotificationSystem = new ErrorNotificationSystem()
