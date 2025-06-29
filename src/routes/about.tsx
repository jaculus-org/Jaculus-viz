import { Box, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: () => <About />,
})

function About() {
  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        How to use JacViz
      </Typography>
    </Box>
  )
}
