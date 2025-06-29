import { Pause, PlayArrow } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'

interface PauseResumeButtonProps {
  paused: boolean
  onClick: () => void
}

function PauseResumeButton({ paused, onClick }: PauseResumeButtonProps) {
  return (
    <Tooltip title={paused ? 'Resume data processing' : 'Pause data processing'}>
      <IconButton
        size="small"
        onClick={onClick}
        sx={{
          color: theme =>
            paused
              ? theme.palette.mode === 'dark'
                ? theme.palette.warning.light
                : theme.palette.warning.dark
              : theme.palette.mode === 'dark'
                ? theme.palette.success.light
                : theme.palette.success.dark,
          backgroundColor: theme =>
            paused
              ? theme.palette.mode === 'dark'
                ? 'rgba(255, 152, 0, 0.1)'
                : 'rgba(255, 152, 0, 0.08)'
              : theme.palette.mode === 'dark'
                ? 'rgba(76, 175, 80, 0.1)'
                : 'rgba(76, 175, 80, 0.08)',
          border: theme =>
            `1px solid ${
              paused
                ? theme.palette.mode === 'dark'
                  ? theme.palette.warning.dark
                  : theme.palette.warning.light
                : theme.palette.mode === 'dark'
                  ? theme.palette.success.dark
                  : theme.palette.success.light
            }`,
          '&:hover': {
            backgroundColor: theme =>
              paused
                ? theme.palette.mode === 'dark'
                  ? 'rgba(255, 152, 0, 0.2)'
                  : 'rgba(255, 152, 0, 0.12)'
                : theme.palette.mode === 'dark'
                  ? 'rgba(76, 175, 80, 0.2)'
                  : 'rgba(76, 175, 80, 0.12)',
            color: theme => (paused ? theme.palette.warning.main : theme.palette.success.main),
            borderColor: theme =>
              paused ? theme.palette.warning.main : theme.palette.success.main,
          },
        }}
      >
        {paused ? <PlayArrow /> : <Pause />}
      </IconButton>
    </Tooltip>
  )
}

export default PauseResumeButton
