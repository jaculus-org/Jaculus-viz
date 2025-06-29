import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export interface TerminalLine {
  id: string
  text: string
  type: 'input' | 'output' | 'error'
  timestamp: Date
}

interface TerminalOutputProps {
  lines: TerminalLine[]
  getLineColor: (type: TerminalLine['type']) => string
  formatTimestamp: (timestamp: Date) => string
  terminalEndRef: React.RefObject<HTMLDivElement>
}

function TerminalOutput({
  lines,
  getLineColor,
  formatTimestamp,
  terminalEndRef,
}: TerminalOutputProps) {
  const theme = useTheme()
  return (
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
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
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
  )
}

export default TerminalOutput
