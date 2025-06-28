import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <Index />,
})

function Index() {
  return (
    <div className="p-2">
      <h1 className="text-3xl font-bold mb-4">Welcome to Jac Viz!</h1>
      <p className="text-gray-600 mb-4">
        This is the home page of your Jaculus visualization application.
      </p>
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Check out the Dashboard for data visualization</li>
          <li>Learn more about the project on the About page</li>
          <li>Use the navigation links above to explore</li>
        </ul>
      </div>
    </div>
  )
}
