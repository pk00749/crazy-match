import { Routes, Route, Link } from 'react-router-dom'
import TodayPage from './pages/TodayPage'
import SchedulePage from './pages/SchedulePage'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🏆 Crazy Match</h1>
          <nav>
            <Link to="/" className="nav-link">今日预测</Link>
            <Link to="/schedule" className="nav-link">完整赛程</Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<TodayPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>2026 世界杯预测平台 · 仅供参考 · 请勿用于投注</p>
      </footer>
    </div>
  )
}

export default App