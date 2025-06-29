// JacViz logging utility for structured data output
// Follows DefaultDataParser format:
// {key:} value [; {key:} value]*
// key = a-zA-Z0-9_ (starts with letter or _), value = number (float/int)

import { stdout } from 'stdio'

export class JacViz {
  /**
   * Log an object as key-value pairs: key1: val1; key2: val2
   * Example: JacViz.logObject({ temperature: 23.5, humidity: 60.2 })
   */
  static logObject(obj: Record<string, number | string>) {
    // Only allow valid keys and numeric values
    const parts = Object.entries(obj)
      .filter(([k, v]) => JacViz._isValidKey(k) && JacViz._isNumeric(v))
      .map(([k, v]) => `${k}: ${Number(v)}`)
    if (parts.length === 0) return
    const line = `${parts.join('; ')}`
    JacViz._write(line)
  }

  /**
   * Log a single key-value pair: key: value
   */
  static logKeyValue(key: string, value: number | string) {
    if (!JacViz._isValidKey(key) || !JacViz._isNumeric(value)) return
    JacViz._write(`${key}: ${Number(value)}`)
  }

  /**
   * Log a raw numeric list: 1; 2; 3
   * Each value will be parsed as keyless (0, 1, 2, ...)
   */
  static logValues(...values: (number | string)[]) {
    const parts = values.filter(JacViz._isNumeric).map(v => `${Number(v)}`)
    if (parts.length === 0) return
    JacViz._write(parts.join('; '))
  }

  /**
   * Log a raw line (advanced, use with care)
   */
  static logRaw(line: string) {
    JacViz._write(line)
  }

  private static _write(line: string) {
    if (stdout && typeof stdout.write === 'function') {
      stdout.write(line + '\n')
    } else if (typeof console !== 'undefined') {
      console.log(line)
    }
  }

  private static _isValidKey(key: string): boolean {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)
  }

  private static _isNumeric(val: unknown): boolean {
    return typeof val === 'number' || (typeof val === 'string' && /^-?\d+(\.\d+)?$/.test(val))
  }
}
