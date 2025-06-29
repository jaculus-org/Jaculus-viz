/**
 * URL parameter utilities for handling browser URL state
 */

/**
 * Updates a URL parameter in the current browser location
 * @param key - The parameter key to update
 * @param value - The parameter value to set
 */
export const updateURLParameter = (key: string, value: string): void => {
  const url = new URL(window.location.href)
  url.searchParams.set(key, value)
  window.history.replaceState({}, '', url.toString())
}

/**
 * Gets a URL parameter value from the current browser location
 * @param key - The parameter key to get
 * @returns The parameter value or null if not found
 */
export const getURLParameter = (key: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(key)
}

/**
 * Removes a URL parameter from the current browser location
 * @param key - The parameter key to remove
 */
export const removeURLParameter = (key: string): void => {
  const url = new URL(window.location.href)
  url.searchParams.delete(key)
  window.history.replaceState({}, '', url.toString())
}

/**
 * Gets multiple URL parameters as an object
 * @param keys - Array of parameter keys to get
 * @returns Object with key-value pairs of the parameters
 */
export const getURLParameters = (keys: string[]): Record<string, string | null> => {
  const urlParams = new URLSearchParams(window.location.search)
  const result: Record<string, string | null> = {}

  keys.forEach(key => {
    result[key] = urlParams.get(key)
  })

  return result
}
