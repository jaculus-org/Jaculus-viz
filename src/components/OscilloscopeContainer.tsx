import { Box, Paper } from '@mui/material'
import type { EChartsOption } from 'echarts'
import ReactECharts from 'echarts-for-react'
import type { JSX } from 'react'

interface OscilloscopeContainerProps {
  chartOption: EChartsOption
  chartRef: React.RefObject<any>
  chartKey: string
  isPaused: boolean
}

export default function OscilloscopeContainer({
  chartOption,
  chartRef,
  chartKey,
  isPaused,
}: OscilloscopeContainerProps): JSX.Element {
  return (
    <Paper sx={{ flex: 1, p: 2, borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ height: '100%' }}>
        <ReactECharts
          ref={chartRef}
          option={chartOption}
          key={chartKey}
          style={{ height: '100%', width: '100%' }}
          notMerge={!isPaused}
          lazyUpdate={true}
          opts={{ renderer: 'canvas' }}
          onEvents={
            isPaused
              ? {
                  dataZoom: (params: any) => {
                    // Handle zoom events when paused
                    console.log('Zoom event:', params)
                  },
                }
              : undefined
          }
        />
      </Box>
    </Paper>
  )
}
