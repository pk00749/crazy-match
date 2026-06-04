import { useLeaderboard } from '../hooks/useLeaderboard'

export default function Leaderboard() {
  const { leaderboard, loading, error, refresh } = useLeaderboard()

  if (loading) return <div className="leaderboard loading">加载中...</div>
  if (error) return <div className="leaderboard error">{error}</div>

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h3>🏆 排行榜</h3>
        <button onClick={refresh}>刷新</button>
      </div>
      <ol className="leaderboard-list">
        {leaderboard.map((entry, i) => (
          <li key={i} className="leaderboard-item">
            <span className="rank">{i + 1}</span>
            <span className="nickname">{entry.nickname}</span>
            <span className="stats">
              {entry.correct_count}/{entry.total_count}
              {entry.current_streak > 0 && ` 🔥${entry.current_streak}`}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}