import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: () => <About />,
})

function About() {
  return (
    <div className="p-2">
      <h1 className="text-3xl font-bold mb-4">About Jac Viz</h1>
      <div className="max-w-2xl space-y-4">
        <p className="text-gray-700">
          Jac Viz is a visualization application for the Jaculus platform, providing
          real-time monitoring and analysis capabilities for embedded systems.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Features</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Real-time data visualization</li>
            <li>Interactive charts and graphs</li>
            <li>System monitoring dashboard</li>
            <li>ESP32 integration support</li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Technology Stack</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>React 19 with TypeScript</li>
            <li>Vite for fast development</li>
            <li>TanStack Router for routing</li>
            <li>Modern CSS for styling</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
