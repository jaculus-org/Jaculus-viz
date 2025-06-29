import { useDevice } from '@/context/device/useDevice'
import TerminalHeader from '@/ui/terminal/TerminalHeader'
import TerminalInput from '@/ui/terminal/TerminalInput'
import TerminalOutput from '@/ui/terminal/TerminalOutput'
import TerminalIcon from '@mui/icons-material/Terminal'
import { Alert, Divider, Paper } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Buffer } from 'buffer'
import { useSnackbar } from 'notistack'
import type { FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface TerminalLine {
  id: string
  text: string
  type: 'input' | 'output' | 'error'
  timestamp: Date
}

export interface TerminalProps {
  maxLines?: number
  height?: number | string
}

const Terminal: FC<TerminalProps> = ({ maxLines = 5000, height = '170vh' }) => {
  const theme = useTheme()
  const { device } = useDevice()
  const { enqueueSnackbar } = useSnackbar()
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [input, setInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const terminalEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when autoScroll is enabled
  useEffect(() => {
    if (autoScroll) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [lines, autoScroll])

  const addLine = useCallback(
    (text: string, type: TerminalLine['type']) => {
      const newLine: TerminalLine = {
        id: Date.now().toString() + Math.random().toString(36),
        text,
        type,
        timestamp: new Date(),
      }

      setLines(prev => {
        const updated = [...prev, newLine]
        // Keep only the last maxLines
        return updated.slice(-maxLines)
      })
    },
    [maxLines]
  )

  // Handle device connection status
  useEffect(() => {
    setIsConnected(!!device)
    if (device) {
      addLine('System connected', 'output')

      device.programOutput.onData((data: any) => {
        addLine(data.toString(), 'output')
      })

      device.programError.onData((data: any) => {
        addLine(data.toString(), 'error')
      })
    } else {
      addLine('System disconnected', 'error')
    }
  }, [device, addLine])

  const handleSendCommand = () => {
    if (!input.trim() || !device) return

    // Add input to terminal
    addLine(`> ${input}`, 'input')

    try {
      device.programInput.write(Buffer.from(input + '\n'))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error sending command'
      addLine(`Error sending command: ${errorMessage}`, 'error')
      enqueueSnackbar(errorMessage, { variant: 'error' })
    }

    setInput('')
    inputRef.current?.focus()
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendCommand()
    }
  }

  const clearTerminal = () => {
    setLines([])
  }

  const toggleAutoScroll = () => {
    setAutoScroll(!autoScroll)
    // If enabling auto-scroll, immediately scroll to bottom
    if (!autoScroll) {
      setTimeout(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input':
        return theme.palette.success.main
      case 'error':
        return theme.palette.error.main
      case 'output':
      default:
        return theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  if (!isConnected) {
    return (
      <Paper
        sx={{
          p: 4,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          boxShadow: theme.shadows[3],
        }}
      >
        <Alert
          severity="info"
          icon={<TerminalIcon />}
          sx={{
            fontSize: '1.1rem',
            '& .MuiAlert-message': {
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          Connect to a device to use the terminal
        </Alert>
      </Paper>
    )
  }

  return (
    <Paper
      sx={{
        height,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: theme.shadows[4],
      }}
    >
      <TerminalHeader
        autoScroll={autoScroll}
        onToggleAutoScroll={toggleAutoScroll}
        onClear={clearTerminal}
      />
      <TerminalOutput
        lines={lines}
        getLineColor={getLineColor}
        formatTimestamp={formatTimestamp}
        terminalEndRef={terminalEndRef as React.RefObject<HTMLDivElement>}
      />
      <Divider />
      <TerminalInput
        input={input}
        setInput={setInput}
        onSend={handleSendCommand}
        onKeyPress={handleKeyPress}
        inputRef={inputRef as React.RefObject<HTMLInputElement>}
        isConnected={isConnected}
      />
    </Paper>
  )
}

export default Terminal
