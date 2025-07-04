import ColorChart from '@/components/ColorChart'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/color')({
  component: () => <ColorChart />,
})
