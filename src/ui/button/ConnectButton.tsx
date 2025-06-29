import { PowerSettingsNew } from '@mui/icons-material'
import { Button } from '@mui/material'
import type { FC, ReactNode } from 'react'

interface ConnectButtonProps {
  onClick: () => void
  disabled?: boolean
  isConnecting?: boolean
  children?: ReactNode
}

const ConnectButton: FC<ConnectButtonProps> = ({ onClick, disabled, isConnecting, children }) => (
  <Button
    variant="contained"
    color="primary"
    onClick={onClick}
    disabled={disabled}
    startIcon={<PowerSettingsNew />}
    size="small"
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

export default ConnectButton
