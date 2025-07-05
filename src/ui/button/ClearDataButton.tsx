import { Clear } from '@mui/icons-material'
import { Button, Tooltip } from '@mui/material'

interface ClearDataButtonProps {
  onClick: () => void
  disabled?: boolean
}

export default function ClearDataButton({ onClick, disabled = false }: ClearDataButtonProps) {
  return (
    <Tooltip title="Clear all stored data">
      <Button
        variant="outlined"
        color="error"
        onClick={onClick}
        disabled={disabled}
        startIcon={<Clear />}
        size="small"
        sx={{ minWidth: 'auto' }}
      >
        Clear Data
      </Button>
    </Tooltip>
  )
}
