import { useDevice } from '@/context/device/useDevice'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DataParser, DeviceDataContextType, ParsedDataEntry } from './DeviceDataContext'
import { DeviceDataContext } from './DeviceDataContext'
import { DefaultDataParser } from './parsers'

interface DeviceDataProviderProps {
  children: ReactNode
  maxEntriesPerKey?: number
}

export function DeviceDataProvider({
  children,
  maxEntriesPerKey = 100000,
}: DeviceDataProviderProps) {
  const { device } = useDevice()
  const [data, setData] = useState<Map<string | number, ParsedDataEntry[]>>(new Map())
  const [isPaused, setIsPaused] = useState(false)
  const [parser, setParser] = useState<DataParser | null>(new DefaultDataParser())

  // Buffer for partial data from device
  const bufferRef = useRef<string>('')

  // Handle incoming device data
  useEffect(() => {
    if (!device || !parser) return

    const handleData = (rawData: string) => {
      if (isPaused) return

      // Add to buffer and process complete lines
      bufferRef.current += rawData
      const lines = bufferRef.current.split('\n')
      bufferRef.current = lines.pop() || '' // Keep incomplete line in buffer

      // Process complete lines
      lines.forEach(line => {
        if (!line.trim()) return

        try {
          const entries = parser.parse(line)
          if (entries.length > 0) {
            addDataEntries(entries)
          }
        } catch (error) {
          console.warn('Failed to parse device data:', line, error)
        }
      })
    }

    // Listen to both output and error streams
    device.programOutput.onData(data => {
      handleData(data.toString())
    })

    device.programError.onData(data => {
      handleData(data.toString())
    })

    return () => {
      // Clear the callbacks when component unmounts
      device.programOutput.onData(undefined)
      device.programError.onData(undefined)
    }
  }, [device, parser, isPaused, maxEntriesPerKey])

  const addDataEntries = useCallback(
    (entries: ParsedDataEntry[]) => {
      setData(prevData => {
        const newData = new Map(prevData)

        entries.forEach(entry => {
          const existingEntries = newData.get(entry.key) || []
          const updatedEntries = [...existingEntries, entry]

          // Keep only the last maxEntriesPerKey entries
          if (updatedEntries.length > maxEntriesPerKey) {
            updatedEntries.splice(0, updatedEntries.length - maxEntriesPerKey)
          }

          newData.set(entry.key, updatedEntries)
        })

        return newData
      })
    },
    [maxEntriesPerKey]
  )

  const setPaused = useCallback((paused: boolean) => {
    setIsPaused(paused)
  }, [])

  const getDataKeys = useCallback(() => {
    return Array.from(data.keys())
  }, [data])

  const getDataForKey = useCallback(
    (key: string | number) => {
      return data.get(key) || []
    },
    [data]
  )

  const getLatestValueForKey = useCallback(
    (key: string | number) => {
      const entries = data.get(key)
      if (!entries || entries.length === 0) return null
      return entries[entries.length - 1].value
    },
    [data]
  )

  const getAllLatestValues = useCallback(() => {
    const latestValues = new Map<string | number, number>()
    data.forEach((entries, key) => {
      if (entries.length > 0) {
        latestValues.set(key, entries[entries.length - 1].value)
      }
    })
    return latestValues
  }, [data])

  const clearData = useCallback(() => {
    setData(new Map())
    bufferRef.current = '' // Clear buffer too
  }, [])

  const clearDataForKey = useCallback((key: string | number) => {
    setData(prevData => {
      const newData = new Map(prevData)
      newData.delete(key)
      return newData
    })
  }, [])

  const getDataCount = useCallback(() => {
    let count = 0
    data.forEach(entries => {
      count += entries.length
    })
    return count
  }, [data])

  const getDataCountForKey = useCallback(
    (key: string | number) => {
      const entries = data.get(key)
      return entries ? entries.length : 0
    },
    [data]
  )

  const contextValue: DeviceDataContextType = useMemo(
    () => ({
      data,
      isPaused,
      setPaused,
      parser,
      setParser,
      getDataKeys,
      getDataForKey,
      getLatestValueForKey,
      getAllLatestValues,
      clearData,
      clearDataForKey,
      getDataCount,
      getDataCountForKey,
    }),
    [
      data,
      isPaused,
      setPaused,
      parser,
      getDataKeys,
      getDataForKey,
      getLatestValueForKey,
      getAllLatestValues,
      clearData,
      clearDataForKey,
      getDataCount,
      getDataCountForKey,
    ]
  )

  return <DeviceDataContext.Provider value={contextValue}>{children}</DeviceDataContext.Provider>
}
