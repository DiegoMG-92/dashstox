import { Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import DarkModeToggle from './components/DarkModeToggle'

function App() {
  return (
    <div>
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>DashStox</h1>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/">Dashboard</Link>
          <Link to="/settings">Settings</Link>
          <DarkModeToggle />
        </nav>
      </header>

      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}

export default App