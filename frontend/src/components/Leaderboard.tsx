import { useState, useEffect } from 'react'
import { getLeaderboard } from '../api/supabase'

interface LeaderboardEntry {
  device_id: string
  nickname: string
  correct_count: number
  total_count: number
  current_streak: number
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadLeaderboard = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getLeaderboard(20)
      setLeaderboard(data)
    } catch (err) {
      console.error('Failed to load leaderboard:', err)
      setError('加载失败')
      // Fallback to mock data
      setLeaderboard([
        { device_id: '1', nickname: '足球专家', correct_count: 12, total_count: 15, current_streak: 5 },
        { device_id: '2', nickname: '预言帝', correct_count: 10, total_count: 14, current_streak: 3 },
        { device_id: '3', nickname: '数据控', correct_count: 9, total_count: 13, current_streak: 2 },
        { device_id: '4', nickname: '直觉王', correct_count: 8, total_count: 12, current_streak: 1 },
        { device_id: '5', nickname: '球迷小李', correct_count: 7, total_count: 11, current_streak: 0 },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeaderboard()
  }, [])

  if (loading) return <div className="leaderboard loading">加载中...</div>
  if (error) return <div className="leaderboard error">{error}</div>

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h3>🏆 排行榜</h3>
        <button className="leaderboard-refresh" onClick={loadLeaderboard}>🔄 刷新</button>
      </div>
      <ol className="leaderboard-list">
        {leaderboard.map((entry, i) => (
          <li key={entry.device_id} className="leaderboard-item">
            <span className="leaderboard-rank">{i + 1}</span>
            <span className="leaderboard-nickname">{entry.nickname}</span>
            <span className="leaderboard-stats">
              {entry.correct_count}/{entry.total_count}
              {entry.current_streak > 0 && <span className="leaderboard-streak"> 🔥{entry.current_streak}</span>}
            </span>
          </li>
        ))}
        {leaderboard.length === 0 && (
          <li className="leaderboard-empty">暂无数据，提交预测成为第一个！</li>
        )}
      </ol>
    </div>
  )
}
