import { useDevice } from '@/context/device/useDevice'
import TerminalHeader from '@/ui/terminal/TerminalHeader'
import TerminalInput from '@/ui/terminal/TerminalInput'
import TerminalOutput from '@/ui/terminal/TerminalOutput'
import TerminalIcon from '@mui/icons-material/Terminal'
import { Alert, Button, Divider, Paper } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Buffer } from 'buffer'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  requestSpaceMice,
  setupSpaceMouse,
  SpaceMouse,
  type Rotation,
  type Translation,
} from 'spacemouse-webhid'

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

export default function Terminal({ maxLines = 5000, height = '170vh' }: TerminalProps) {
  const theme = useTheme()
  const { device } = useDevice()

  const { enqueueSnackbar } = useSnackbar()
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [input, setInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const [isSpaceMouseConnected, setIsSpaceMouseConnected] = useState(false)
  const terminalEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastTranslateSent = useRef<number>(0)
  const lastRotateSent = useRef<number>(0)
  const [, setSpaceMouse] = useState<SpaceMouse | null>(null)
  const sendInterval = 100 // ms

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

      device.programOutput.onData((data: string | Buffer | Uint8Array) => {
        addLine(data.toString(), 'output')
      })

      device.programError.onData((data: string | Buffer | Uint8Array) => {
        addLine(data.toString(), 'error')
      })
    } else {
      addLine('System disconnected', 'error')
    }
  }, [device, addLine])

  // Connect SpaceMouse handler
  const handleConnectSpaceMouse = async () => {
    try {
      const devices = await requestSpaceMice()
      if (devices.length === 0) {
        enqueueSnackbar('No SpaceMouse device selected', { variant: 'warning' })
        return
      }
      const sm = await setupSpaceMouse(devices[0])
      setSpaceMouse(sm)
      setIsSpaceMouseConnected(true)
      addLine(`SpaceMouse connected: ${sm.info.name}`, 'output')

      sm.on('error', (error: Error) => {
        addLine(`SpaceMouse error: ${error}`, 'error')
        setIsSpaceMouseConnected(false)
      })
      sm.on('disconnected', () => {
        addLine('SpaceMouse disconnected', 'error')
        setIsSpaceMouseConnected(false)
        setSpaceMouse(null)
      })
      sm.on('translate', (translate: Translation) => {
        const now = Date.now()
        if (now - lastTranslateSent.current >= sendInterval) {
          sendTranslate(translate)
        } else {
          setTimeout(
            () => sendTranslate(translate),
            sendInterval - (now - lastTranslateSent.current)
          )
        }
      })
      sm.on('rotate', (rotate: Rotation) => {
        const now = Date.now()
        if (
          now - lastRotateSent.current >= sendInterval ||
          (rotate.yaw === 0 && rotate.pitch === 0 && rotate.roll === 0)
        ) {
          sendRotate(rotate)
        }
        // else: ignore this event, do not queue or delay
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error connecting SpaceMouse'
      addLine(`Error connecting SpaceMouse: ${errorMessage}`, 'error')
      enqueueSnackbar(errorMessage, { variant: 'error' })
    }
  }

  function sendTranslate(translate: Translation) {
    if (!translate || !device) return
    lastTranslateSent.current = Date.now()
    const msg = `x:${translate.x};y:${translate.y};z:${translate.z}\n`
    try {
      device.programInput.write(Buffer.from(msg))
      addLine(`> ${msg.trim()}`, 'input')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error sending SpaceMouse data'
      addLine(`Error sending SpaceMouse data: ${errorMessage}`, 'error')
      enqueueSnackbar(errorMessage, { variant: 'error' })
    }
  }

  function sendRotate(rotate: Rotation) {
    if (!rotate || !device) return
    lastRotateSent.current = Date.now()
    const msg = `yaw:${rotate.yaw};pitch:${rotate.pitch};roll:${rotate.roll}\n`
    try {
      device.programInput.write(Buffer.from(msg))
      addLine(`> ${msg.trim()}`, 'input')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error sending SpaceMouse data'
      addLine(`Error sending SpaceMouse data: ${errorMessage}`, 'error')
      enqueueSnackbar(errorMessage, { variant: 'error' })
    }
  }

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
      <Button
        variant={isSpaceMouseConnected ? 'contained' : 'outlined'}
        color={isSpaceMouseConnected ? 'success' : 'primary'}
        onClick={handleConnectSpaceMouse}
        sx={{ m: 2, alignSelf: 'flex-end' }}
      >
        {isSpaceMouseConnected ? 'SpaceMouse Connected' : 'Connect SpaceMouse'}
      </Button>
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
