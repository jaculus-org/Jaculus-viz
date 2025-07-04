import { Box, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'
import SpaceMouse3d from '../components/SpaceMouse3d'

export const Route = createFileRoute('/mouse')({
  component: () => <SpaceMousePage />,
})

function SpaceMousePage() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h1" gutterBottom>
        Space Mouse
      </Typography>
      <SpaceMouse3d height="calc(100vh - 180px)" />
    </Box>
  )
}
