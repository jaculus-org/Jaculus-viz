import Chart from '@/components/Chart'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chart')({
  component: Chart,
})
