import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/dashboard')({
  component: () => <Dashboard />,
})

function Dashboard() {
  const [data, setData] = useState<number[]>([])
  const [isConnected, setIsConnected] = useState(false)

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => [
        ...prev.slice(-9), // Keep last 9 values
        Math.floor(Math.random() * 100)
      ])
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const toggleConnection = () => {
    setIsConnected(!isConnected)
  }

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={toggleConnection}
          className={`px-4 py-2 rounded-lg font-medium ${
            isConnected
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          Status: {isConnected ? 'Connected' : 'Disconnected'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">CPU Usage</h3>
          <div className="text-3xl font-bold text-blue-600">
            {data.length > 0 ? `${data[data.length - 1]}%` : '0%'}
          </div>
          <p className="text-sm text-blue-600 mt-1">Real-time monitoring</p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Memory</h3>
          <div className="text-3xl font-bold text-green-600">
            {data.length > 0 ? `${Math.floor(data[data.length - 1] * 0.8)}MB` : '0MB'}
          </div>
          <p className="text-sm text-green-600 mt-1">Available: 512MB</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">Uptime</h3>
          <div className="text-3xl font-bold text-purple-600">12:34:56</div>
          <p className="text-sm text-purple-600 mt-1">Running stable</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Real-time Data Visualization</h2>
        <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-center p-4">
          <div className="flex items-end space-x-2 h-full">
            {data.map((value, index) => (
              <div
                key={index}
                className="bg-blue-500 rounded-t"
                style={{
                  height: `${(value / 100) * 100}%`,
                  width: '20px',
                  minHeight: '4px'
                }}
                title={`Value: ${value}`}
              />
            ))}
          </div>
          {data.length === 0 && (
            <div className="text-gray-500 text-center">
              Waiting for data...
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Chart updates every second with simulated sensor data
        </p>
      </div>
    </div>
  )
}
