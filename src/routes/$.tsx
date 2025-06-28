import { createFileRoute, Link } from '@tanstack/react-router'
import { Typography, Box, Button, Container } from '@mui/material'
import { Home } from '@mui/icons-material'

export const Route = createFileRoute('/$')({
  component: () => <NotFound />,
})

function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h1" sx={{ fontSize: '6rem', color: 'text.secondary', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          size="large"
          startIcon={<Home />}
          sx={{ mt: 3 }}
        >
          Go Back Home
        </Button>
      </Box>
    </Container>
  )
}
