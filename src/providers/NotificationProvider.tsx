import { errorNotificationSystem } from '@/utils/errorNotification'
import { Close } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { SnackbarProvider, closeSnackbar, useSnackbar } from 'notistack'
import type { FC, ReactNode } from 'react'
import { useEffect } from 'react'

interface NotificationProviderProps {
  children: ReactNode
}

const NotificationInitializer: FC = () => {
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    // Initialize the global error notification system
    errorNotificationSystem.setEnqueueSnackbar(enqueueSnackbar)
  }, [enqueueSnackbar])

  return null
}

export default function NotificationProvider({ children }: NotificationProviderProps) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
      <NotificationInitializer />
      {children}
    </SnackbarProvider>
  )
}
