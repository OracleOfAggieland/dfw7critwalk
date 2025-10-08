import { Logo } from './assets/Logo'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <Logo size="large" />
      <h1 className="text-3xl font-bold text-gray-900">DFW7 RME Crit Walk Dashboard</h1>
      <p className="text-gray-600">Reliability Maintenance Engineering</p>
    </div>
  )
}

export default App
