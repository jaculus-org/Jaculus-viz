import Chart from '@/components/Chart'
import { Box, Typography } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <ChartPage />,
})

function ChartPage() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h2" sx={{ mb: 2 }}>
        Chart
      </Typography>
      <Chart />
    </Box>
  )
}
