import { useDevice } from '@/context/device/useDevice'
import {
  Clear,
  Send,
  Terminal as TerminalIcon,
  VerticalAlignBottom,
  VerticalAlignBottomOutlined,
} from '@mui/icons-material'
import {
  Alert,
  Box,
  Divider,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
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

      device.programOutput.onData(data => {
        addLine(data.toString(), 'output')
      })

      device.programError.onData(data => {
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
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TerminalIcon sx={{ color: theme.palette.primary.main, fontSize: '1.5rem' }} />
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 600,
            }}
          >
            Terminal
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={autoScroll ? 'Disable auto-scroll' : 'Enable auto-scroll'}>
            <IconButton
              size="medium"
              onClick={toggleAutoScroll}
              sx={{
                color: autoScroll ? theme.palette.primary.main : theme.palette.text.secondary,
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              {autoScroll ? <VerticalAlignBottom /> : <VerticalAlignBottomOutlined />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear terminal">
            <IconButton
              size="medium"
              onClick={clearTerminal}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <Clear />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Terminal Output */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          bgcolor: theme.palette.mode === 'dark' ? '#0d1117' : '#f8f9fa',
          fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
          fontSize: '15px',
          lineHeight: 1.5,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.mode === 'dark' ? '#21262d' : '#e1e4e8',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.mode === 'dark' ? '#484f58' : '#c1c8cd',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.mode === 'dark' ? '#5a6269' : '#a8b3ba',
          },
        }}
      >
        {lines.map(line => (
          <Box
            key={line.id}
            sx={{
              display: 'flex',
              mb: 1,
              color: getLineColor(line.type),
              '&:hover': {
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.02)'
                    : 'rgba(0, 0, 0, 0.02)',
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.disabled,
                mr: 2,
                minWidth: '70px',
                fontFamily: 'inherit',
                fontSize: '13px',
                alignSelf: 'flex-start',
                mt: 0.2,
              }}
            >
              {formatTimestamp(line.timestamp)}
            </Typography>
            <Typography
              sx={{
                fontFamily: 'inherit',
                fontSize: '15px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                flex: 1,
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
      <Box
        sx={{
          p: 2,
          display: 'flex',
          gap: 2,
          bgcolor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <TextField
          ref={inputRef}
          fullWidth
          size="medium"
          variant="outlined"
          placeholder="Enter command and press Enter..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!isConnected}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
              fontSize: '15px',
              bgcolor:
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              '&:hover': {
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
              },
              '&.Mui-focused': {
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.06)',
              },
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSendCommand}
          disabled={!input.trim() || !isConnected}
          size="large"
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
            '&:disabled': {
              bgcolor: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
            },
          }}
        >
          <Send />
        </IconButton>
      </Box>
    </Paper>
  )
}

export default Terminal
