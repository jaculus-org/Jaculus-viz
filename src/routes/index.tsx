import { createFileRoute } from '@tanstack/react-router'
import { Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material'

export const Route = createFileRoute('/')({
  component: () => <Index />,
})

function Index() {
  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        Welcome to Jac Viz!
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        This is the home page of your Jaculus visualization application.
      </Typography>
      <Paper elevation={1} sx={{ p: 3, backgroundColor: 'primary.light' }}>
        <Typography variant="h2" gutterBottom color="primary.contrastText">
          Getting Started
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Check out the Dashboard for data visualization"
              sx={{ color: 'primary.contrastText' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Learn more about the project on the About page"
              sx={{ color: 'primary.contrastText' }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Use the navigation links above to explore"
              sx={{ color: 'primary.contrastText' }}
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  )
}
