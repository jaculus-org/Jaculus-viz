import {
  Clear,
  Terminal as TerminalIcon,
  VerticalAlignBottom,
  VerticalAlignBottomOutlined,
} from '@mui/icons-material'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

interface TerminalHeaderProps {
  autoScroll: boolean
  onToggleAutoScroll: () => void
  onClear: () => void
}

function TerminalHeader({ autoScroll, onToggleAutoScroll, onClear }: TerminalHeaderProps) {
  const theme = useTheme()
  return (
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
            onClick={onToggleAutoScroll}
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
            onClick={onClear}
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
  )
}

export default TerminalHeader
