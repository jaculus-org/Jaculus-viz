/**
 * Utility functions for handling timeouts in async operations
 */

/**
 * Wraps a promise with a timeout, racing between the original promise and a timeout rejection
 * @param promise - The promise to wrap with timeout
 * @param timeoutMs - Timeout duration in milliseconds (default: 5000ms)
 * @returns Promise that resolves with the original promise or rejects with timeout error
 */
export const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)
    ),
  ])
}

/**
 * Creates a delay promise that resolves after the specified milliseconds
 * @param ms - Delay duration in milliseconds
 * @returns Promise that resolves after the delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
