import { Power } from '@mui/icons-material'
import { Button } from '@mui/material'
import type { ReactNode } from 'react'

interface DisconnectButtonProps {
  onClick: () => void
  children?: ReactNode
}

function DisconnectButton({ onClick, children }: DisconnectButtonProps) {
  return (
    <Button
      variant="contained"
      color="error"
      onClick={onClick}
      startIcon={<Power />}
      size="small"
      sx={{
        '&:hover': {
          backgroundColor: 'error.dark',
        },
      }}
    >
      {children || 'Disconnect'}
    </Button>
  )
}

export default DisconnectButton
