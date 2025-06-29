import { Close } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { SnackbarProvider, closeSnackbar } from 'notistack'
import type { ReactNode } from 'react'

interface NotificationProviderProps {
  children: ReactNode
}

// const NotificationProvider: FC<NotificationProviderProps> = ({ children }) => {
export default function NotificationProvider({ children }: NotificationProviderProps) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={5000}
      preventDuplicate
      action={snackbarId => (
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={() => closeSnackbar(snackbarId)}
        >
          <Close fontSize="small" />
        </IconButton>
      )}
    >
      {children}
    </SnackbarProvider>
  )
}
