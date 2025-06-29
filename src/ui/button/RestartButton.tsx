import { Refresh } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import type { FC } from 'react'

interface RestartButtonProps {
  onClick: () => void
}

const RestartButton: FC<RestartButtonProps> = ({ onClick }) => (
  <Tooltip title="Restart device">
    <IconButton
      size="small"
      onClick={onClick}
      sx={{
        color: theme =>
          theme.palette.mode === 'dark' ? theme.palette.info.light : theme.palette.info.dark,
        backgroundColor: theme =>
          theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.08)',
        border: theme =>
          `1px solid ${
            theme.palette.mode === 'dark' ? theme.palette.info.dark : theme.palette.info.light
          }`,
        '&:hover': {
          backgroundColor: theme =>
            theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.12)',
          color: theme => theme.palette.info.main,
          borderColor: theme => theme.palette.info.main,
        },
      }}
    >
      <Refresh />
    </IconButton>
  </Tooltip>
)

export default RestartButton
