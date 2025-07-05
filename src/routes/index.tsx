import Chart from '@/components/Chart'
import { Box } from '@mui/material'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <ChartPage />,
})

function ChartPage() {
  return (
    <Box sx={{ mt: 4 }}>
      <Chart />
    </Box>
  )
}
