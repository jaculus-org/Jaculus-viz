import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import {
  Brightness4,
  Brightness7,
  SettingsBrightness,
  LightMode,
  DarkMode,
  Computer
} from '@mui/icons-material'
import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'

export function ThemeToggle() {
  const { mode, setMode, actualMode } = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleModeSelect = (selectedMode: 'light' | 'dark' | 'system') => {
    setMode(selectedMode)
    handleClose()
  }

  const getIcon = () => {
    if (mode === 'system') {
      return <SettingsBrightness />
    }
    return actualMode === 'dark' ? <DarkMode /> : <LightMode />
  }

  const getModeLabel = (modeType: 'light' | 'dark' | 'system') => {
    switch (modeType) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      case 'system':
        return 'System'
    }
  }

  const getModeIcon = (modeType: 'light' | 'dark' | 'system') => {
    switch (modeType) {
      case 'light':
        return <Brightness7 />
      case 'dark':
        return <Brightness4 />
      case 'system':
        return <Computer />
    }
  }

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label="toggle theme"
        aria-controls={open ? 'theme-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        {getIcon()}
      </IconButton>
      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {(['light', 'dark', 'system'] as const).map((modeOption) => (
          <MenuItem
            key={modeOption}
            onClick={() => handleModeSelect(modeOption)}
            selected={mode === modeOption}
          >
            <ListItemIcon>
              {getModeIcon(modeOption)}
            </ListItemIcon>
            <ListItemText primary={getModeLabel(modeOption)} />
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
