import { PowerSettingsNew } from '@mui/icons-material'
import { Button } from '@mui/material'
import type { ReactNode } from 'react'

interface ConnectButtonProps {
  onClick: () => void
  disabled?: boolean
  isConnecting?: boolean
  children?: ReactNode
}

function ConnectButton({ onClick, disabled, isConnecting, children }: ConnectButtonProps) {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={disabled}
      startIcon={<PowerSettingsNew />}
      sx={{
        '&:hover': {
          backgroundColor: 'primary.dark',
        },
        '&:disabled': {
          backgroundColor: 'action.disabledBackground',
          color: 'action.disabled',
        },
      }}
    >
      {isConnecting ? 'Connecting...' : children || 'Connect'}
    </Button>
  )
}

export default ConnectButton
