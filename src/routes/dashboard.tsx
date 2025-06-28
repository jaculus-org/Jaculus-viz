import Terminal from '@/components/Terminal'
import { Box, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: () => <TerminalPage />,
})

function TerminalPage() {
  return (
    <Box sx={{ height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', p: 0.5 }}>
      <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 600, color: 'text.primary', px: 1 }}>
        Terminal
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <Terminal height="100%" />
      </Box>
    </Box>
  )
}
