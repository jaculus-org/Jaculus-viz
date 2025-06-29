import { Bluetooth, Usb } from '@mui/icons-material'
import { Box, Tooltip } from '@mui/material'
import type { FC } from 'react'

interface ConnectionIconProps {
  type: 'serial' | 'ble'
}

const ConnectionIcon: FC<ConnectionIconProps> = ({ type }) => (
  <Tooltip title={`Connected via ${type.toUpperCase()}`}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1,
        borderRadius: 1,
        backgroundColor: theme => (theme.palette.mode === 'dark' ? 'success.dark' : 'success.main'),
        color: theme => (theme.palette.mode === 'dark' ? 'success.contrastText' : 'white'),
        '& svg': {
          color: 'inherit',
        },
      }}
    >
      {type === 'ble' ? <Bluetooth fontSize="small" /> : <Usb fontSize="small" />}
    </Box>
  </Tooltip>
)

export default ConnectionIcon
