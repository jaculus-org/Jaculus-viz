import { createFileRoute } from '@tanstack/react-router'
import Chart from '@/components/Chart'

export const Route = createFileRoute('/chart')({
  component: Chart,
})
