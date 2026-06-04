import { useState, useEffect } from 'react'
import { getLeaderboard, getUserPredictions } from '../api/supabase'

interface Prediction {
  id: string
  match_id: string
  device_id: string
  nickname: string
  predicted_winner: 'teamA' | 'teamB' | 'draw'
  created_at: string
}

interface LeaderboardEntry {
  device_id: string
  nickname: string
  correct_count: number
  total_count: number
  current_streak: number
}

export default function Leaderboard() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'predictions' | 'ranking'>('predictions')

  const loadData = async () => {
    setLoading(true)
    try {
      const [predData, rankData] = await Promise.all([
        getUserPredictions(),
        getLeaderboard(20)
      ])
      setPredictions(predData)
      setLeaderboard(rankData)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getPredictionLabel = (winner: string) => {
    switch (winner) {
      case 'teamA': return '主队胜'
      case 'teamB': return '客队胜'
      case 'draw': return '平局'
      default: return winner
    }
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h3>📊 预测数据</h3>
        <button className="leaderboard-refresh" onClick={loadData}>🔄 刷新</button>
      </div>

      {/* Tab 切换 */}
      <div className="leaderboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'predictions' ? 'active' : ''}`}
          onClick={() => setActiveTab('predictions')}
        >
          预测记录 ({predictions.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ranking' ? 'active' : ''}`}
          onClick={() => setActiveTab('ranking')}
        >
          排行榜
        </button>
      </div>

      {loading ? (
        <div className="leaderboard-loading">加载中...</div>
      ) : activeTab === 'predictions' ? (
        /* 预测记录列表 */
        <div className="predictions-list">
          {predictions.length === 0 ? (
            <div className="leaderboard-empty">
              暂无预测记录<br/>
              <span>提交预测成为第一个！</span>
            </div>
          ) : (
            predictions.slice(0, 20).map((pred, i) => (
              <div key={pred.id} className="prediction-item">
                <div className="prediction-rank">#{i + 1}</div>
                <div className="prediction-info">
                  <div className="prediction-nickname">{pred.nickname}</div>
                  <div className="prediction-meta">
                    <span className="prediction-time">{formatTime(pred.created_at)}</span>
                  </div>
                </div>
                <div className="prediction-result">
                  <span className={`prediction-badge ${pred.predicted_winner}`}>
                    {getPredictionLabel(pred.predicted_winner)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* 排行榜 */
        <div className="leaderboard-list">
          {leaderboard.length === 0 ? (
            <div className="leaderboard-empty">
              暂无排行数据<br/>
              <span>比赛结束后自动更新</span>
            </div>
          ) : (
            leaderboard.map((entry, i) => (
              <div key={entry.device_id} className="leaderboard-item">
                <span className={`leaderboard-rank ${i < 3 ? 'top' : ''}`}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </span>
                <div className="leaderboard-info">
                  <span className="leaderboard-nickname">{entry.nickname}</span>
                  <span className="leaderboard-accuracy">
                    准确率 {Math.round(entry.correct_count / entry.total_count * 100)}%
                  </span>
                </div>
                <div className="leaderboard-stats">
                  <span className="stats-correct">{entry.correct_count}/{entry.total_count}</span>
                  {entry.current_streak > 0 && (
                    <span className="leaderboard-streak">🔥 {entry.current_streak}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
