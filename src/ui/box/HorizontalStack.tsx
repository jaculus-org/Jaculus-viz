import { Box } from '@mui/material'
import type { ReactNode } from 'react'

interface HorizontalStackProps {
  children: ReactNode
  gap?: number
  alignItems?: string
}

function HorizontalStack({ children, gap = 2, alignItems = 'center' }: HorizontalStackProps) {
  return <Box sx={{ display: 'flex', alignItems, gap }}>{children}</Box>
}

export default HorizontalStack
