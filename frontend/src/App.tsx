import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import TodayPage from './pages/TodayPage'
import SchedulePage from './pages/SchedulePage'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <div className="header-brand">
            <span className="header-logo">⚽</span>
            <h1 className="header-title">Crazy Match</h1>
            <span className="header-badge">2026 世界杯</span>
          </div>
          <nav>
            <NavLink to="/today" className={({ isActive }) => isActive ? 'active' : ''}>
              今日预测
            </NavLink>
            <NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''}>
              完整赛程
            </NavLink>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/today" element={<TodayPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/" element={<TodayPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
