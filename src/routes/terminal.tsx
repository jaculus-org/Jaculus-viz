import Terminal from '@/components/Terminal'
import { Box, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terminal')({
  component: () => <TerminalPage />,
})

function TerminalPage() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h2" sx={{ mb: 2 }}>
        Terminal
      </Typography>
      <Terminal height="calc(100vh - 180px)" />
    </Box>
  )
}
