import type { FC } from 'react'
import { useState, useEffect, useRef } from 'react'
import { Box, Paper, TextField, Typography, IconButton, Divider, Alert } from '@mui/material'
import { Send, Clear, Terminal as TerminalIcon } from '@mui/icons-material'
import { useDevice } from '@/context/device/useDevice'

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

const Terminal: FC<TerminalProps> = ({ maxLines = 1000, height = 400 }) => {
  const { device } = useDevice()
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [input, setInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const terminalEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  // Handle device connection status
  useEffect(() => {
    setIsConnected(!!device)
    if (device) {
      addLine('System connected', 'output')

      // Set up device data listener (if available)
      // Note: This depends on the actual JacDevice API
      // device.onData?.((data: Buffer) => {
      //   addLine(data.toString(), 'output')
      // })

      // device.onError?.((error: Error) => {
      //   addLine(`Error: ${error.message}`, 'error')
      // })
    } else {
      addLine('System disconnected', 'error')
    }
  }, [device])

  const addLine = (text: string, type: TerminalLine['type']) => {
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
  }

  const handleSendCommand = () => {
    if (!input.trim() || !device) return

    // Add input to terminal
    addLine(`> ${input}`, 'input')

    try {
      // TODO: Send command to device
      // This depends on the actual JacDevice API
      // For now, we'll just echo back
      addLine(`Echo: ${input}`, 'output')

      // Example of how you might send data:
      // device.write(Buffer.from(input + '\n'))
    } catch (error) {
      addLine(`Error sending command: ${error}`, 'error')
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

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input':
        return '#4caf50' // green
      case 'error':
        return '#f44336' // red
      case 'output':
      default:
        return '#ffffff' // white
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
      <Paper sx={{ p: 2, height }}>
        <Alert severity="info" icon={<TerminalIcon />}>
          Connect to a device to use the terminal
        </Alert>
      </Paper>
    )
  }

  return (
    <Paper sx={{ height, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'grey.900',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TerminalIcon sx={{ color: 'grey.400' }} />
          <Typography variant="subtitle2" sx={{ color: 'grey.400' }}>
            Terminal
          </Typography>
        </Box>
        <IconButton size="small" onClick={clearTerminal} sx={{ color: 'grey.400' }}>
          <Clear />
        </IconButton>
      </Box>

      {/* Terminal Output */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 1,
          bgcolor: '#1a1a1a',
          fontFamily: 'monospace',
          fontSize: '14px',
        }}
      >
        {lines.map(line => (
          <Box
            key={line.id}
            sx={{
              display: 'flex',
              mb: 0.5,
              color: getLineColor(line.type),
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'grey.500',
                mr: 1,
                minWidth: '60px',
                fontFamily: 'monospace',
              }}
            >
              {formatTimestamp(line.timestamp)}
            </Typography>
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: '14px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {line.text}
            </Typography>
          </Box>
        ))}
        <div ref={terminalEndRef} />
      </Box>

      <Divider />

      {/* Input */}
      <Box sx={{ p: 1, display: 'flex', gap: 1, bgcolor: 'grey.100' }}>
        <TextField
          ref={inputRef}
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Enter command..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: 'monospace',
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSendCommand}
          disabled={!input.trim() || !isConnected}
        >
          <Send />
        </IconButton>
      </Box>
    </Paper>
  )
}

export default Terminal
