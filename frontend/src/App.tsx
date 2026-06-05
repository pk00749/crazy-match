import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import TodayPage from './pages/TodayPage'
import SchedulePage from './pages/SchedulePage'
import { useEffect, useState } from 'react'

function App() {
  const [daysLeft, setDaysLeft] = useState(0)

  useEffect(() => {
    const kickoff = new Date('2026-06-11T00:00:00')
    const now = new Date()
    const diff = Math.max(0, Math.ceil((kickoff.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    setDaysLeft(diff)
  }, [])

  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <div className="header-brand">
            <span className="header-logo">🏆</span>
            <div>
              <div className="header-title">Crazy Match</div>
              <div className="header-sub">2026 世界杯预测 · 美墨加</div>
            </div>
          </div>
          
          <div className="header-countdown">
            <span className="countdown-num">{daysLeft}</span>
            <span className="countdown-label">天后开幕</span>
          </div>

          <nav className="header-nav">
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
