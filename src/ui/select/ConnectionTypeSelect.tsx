import { Bluetooth, Usb } from '@mui/icons-material'
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import type { FC } from 'react'

interface ConnectionTypeSelectProps {
  value: string
  supportedTypes: string[]
  onChange: (value: string) => void
}

const ConnectionTypeSelect: FC<ConnectionTypeSelectProps> = ({
  value,
  supportedTypes,
  onChange,
}) => (
  <FormControl
    size="small"
    sx={{
      minWidth: 120,
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'background.paper',
        color: 'text.primary',
        '& fieldset': {
          borderColor: 'divider',
        },
        '&:hover fieldset': {
          borderColor: 'primary.main',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'primary.main',
        },
      },
      '& .MuiInputLabel-root': {
        color: 'text.secondary',
        '&.Mui-focused': {
          color: 'primary.main',
        },
      },
      '& .MuiSelect-icon': {
        color: 'text.secondary',
      },
    }}
  >
    <InputLabel>Connection</InputLabel>
    <Select
      value={value}
      label="Connection"
      onChange={e => onChange(e.target.value as string)}
      MenuProps={{
        PaperProps: {
          sx: {
            backgroundColor: 'background.paper',
            border: theme => `1px solid ${theme.palette.divider}`,
            '& .MuiMenuItem-root': {
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: 'action.selected',
                },
              },
            },
          },
        },
      }}
    >
      {supportedTypes.includes('serial') && (
        <MenuItem value="serial">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Usb fontSize="small" />
            <Typography variant="body2">Serial</Typography>
          </Box>
        </MenuItem>
      )}
      {supportedTypes.includes('ble') && (
        <MenuItem value="ble">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Bluetooth fontSize="small" />
            <Typography variant="body2">BLE</Typography>
          </Box>
        </MenuItem>
      )}
      {supportedTypes.length === 0 && (
        <MenuItem disabled>
          <Typography variant="body2" color="text.secondary">
            No supported connection types
          </Typography>
        </MenuItem>
      )}
    </Select>
  </FormControl>
)

export default ConnectionTypeSelect
