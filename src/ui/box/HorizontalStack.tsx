import { Box } from '@mui/material'
import type { FC, ReactNode } from 'react'

interface HorizontalStackProps {
  children: ReactNode
  gap?: number
  alignItems?: string
}

const HorizontalStack: FC<HorizontalStackProps> = ({
  children,
  gap = 2,
  alignItems = 'center',
}) => <Box sx={{ display: 'flex', alignItems, gap }}>{children}</Box>

export default HorizontalStack
