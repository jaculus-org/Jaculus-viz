import { createContext } from 'react'

export interface ParsedDataEntry {
  key: string | number
  value: number
  timestamp: number
}

export interface DataParser {
  parse(data: string): ParsedDataEntry[]
}

export interface DeviceDataContextType {
  // Data storage
  data: Map<string | number, ParsedDataEntry[]>

  // Control
  isPaused: boolean
  setPaused: (paused: boolean) => void

  // Parser
  parser: DataParser | null
  setParser: (parser: DataParser | null) => void

  // Data access methods
  getDataKeys: () => (string | number)[]
  getDataForKey: (key: string | number) => ParsedDataEntry[]
  getLatestValueForKey: (key: string | number) => number | null
  getAllLatestValues: () => Map<string | number, number>

  // Data management
  clearData: () => void
  clearDataForKey: (key: string | number) => void

  // Statistics
  getDataCount: () => number
  getDataCountForKey: (key: string | number) => number
}

export const DeviceDataContext = createContext<DeviceDataContextType | null>(null)
