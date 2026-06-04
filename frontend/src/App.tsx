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
        <header className="header-hero">
          <div className="header-hero-left">
            <span className="trophy-icon">🏆</span>
            <div>
              <div className="header-hero-title">
                <span>2026 世界杯预测</span>
              </div>
              <div className="header-hero-sub">美墨加三国联合举办 · 48支球队 · 87场比赛</div>
            </div>
          </div>
          <div className="wc-countdown">
            <div>
              <div className="wc-countdown-days">距离开幕</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span className="wc-countdown-num">{daysLeft}</span>
                <span className="wc-countdown-label">天</span>
              </div>
            </div>
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
