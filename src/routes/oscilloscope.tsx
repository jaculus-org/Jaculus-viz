import Oscilloscope from '@/components/Oscilloscope'
import { Box } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/oscilloscope')({
  component: () => <OscilloscopePage />,
})

function OscilloscopePage() {
  return (
    <Box sx={{ mt: 4 }}>
      <Oscilloscope />
    </Box>
  )
}
