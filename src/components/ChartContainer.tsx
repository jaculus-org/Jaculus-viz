import { Box, Paper } from '@mui/material'
import type { ChartOptions } from 'chart.js'
import type { FC } from 'react'
import { Line } from 'react-chartjs-2'

interface ChartContainerProps {
  chartData: any
  chartOptions: ChartOptions<'line'>
  chartRef: React.RefObject<any>
  chartKey: string
}

const ChartContainer: FC<ChartContainerProps> = ({
  chartData,
  chartOptions,
  chartRef,
  chartKey,
}) => (
  <Paper sx={{ flex: 1, p: 2, borderRadius: 2, overflow: 'hidden' }}>
    <Box sx={{ height: '100%' }}>
      <Line ref={chartRef} data={chartData} options={chartOptions} key={chartKey} />
    </Box>
  </Paper>
)

export default ChartContainer
