import { Send } from '@mui/icons-material'
import { Box, IconButton, TextField } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { FC, RefObject } from 'react'

interface TerminalInputProps {
  input: string
  setInput: (val: string) => void
  onSend: () => void
  onKeyPress: (event: React.KeyboardEvent) => void
  inputRef: RefObject<HTMLInputElement>
  isConnected: boolean
}

const TerminalInput: FC<TerminalInputProps> = ({
  input,
  setInput,
  onSend,
  onKeyPress,
  inputRef,
  isConnected,
}) => {
  const theme = useTheme()
  return (
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
        onKeyPress={onKeyPress}
        disabled={!isConnected}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
            fontSize: '15px',
            bgcolor:
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            '&:hover': {
              bgcolor:
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            },
            '&.Mui-focused': {
              bgcolor:
                theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
            },
          },
        }}
      />
      <IconButton
        color="primary"
        onClick={onSend}
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
  )
}

export default TerminalInput
