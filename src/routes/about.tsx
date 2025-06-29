import { Box, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import { About } from '../components/About'

export const Route = createFileRoute('/about')({
  component: () => <AboutPage />,
})

function AboutPage() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h1" gutterBottom>
        How to use JacViz
      </Typography>
      <About />
    </Box>
  )
}
