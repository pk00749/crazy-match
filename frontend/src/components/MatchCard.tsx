import { useState, useEffect } from 'react'
import { getUserPredictions, getLeaderboard } from '../api/supabase'
import TeamModal from './TeamModal'

interface MatchCardProps {
  match: {
    id: string
    team_a_code: string
    team_a: string
    team_b_code: string
    team_b: string
    time: string
    venue: string
    stage?: string
    group?: string
  }
  isSelected?: boolean
  prediction?: any
  onPredict?: (matchId: string) => void
  onShare?: (matchId: string) => void
  onSelect?: (matchId: string) => void
}

interface Prediction {
  id: string
  match_id: string
  nickname: string
  predicted_winner: string
  created_at: string
}

interface LeaderboardEntry {
  device_id: string
  nickname: string
  correct_count: number
  total_count: number
  current_streak: number
}

const teamFlags: Record<string, string> = {
  ARG: 'https://flagcdn.com/w160/ar.png', MEX: 'https://flagcdn.com/w160/mx.png',
  CAN: 'https://flagcdn.com/w160/ca.png', GUA: 'https://flagcdn.com/w160/gt.png',
  ESP: 'https://flagcdn.com/w160/es.png', BRA: 'https://flagcdn.com/w160/br.png',
  ECU: 'https://flagcdn.com/w160/ec.png', PAR: 'https://flagcdn.com/w160/py.png',
  FRA: 'https://flagcdn.com/w160/fr.png', EGY: 'https://flagcdn.com/w160/eg.png',
  NZL: 'https://flagcdn.com/w160/nz.png', VAN: 'https://flagcdn.com/w160/vu.png',
  ENG: 'https://flagcdn.com/w160/gb.png', POR: 'https://flagcdn.com/w160/pt.png',
  MAR: 'https://flagcdn.com/w160/ma.png', MAS: 'https://flagcdn.com/w160/my.png',
  GER: 'https://flagcdn.com/w160/de.png', JPN: 'https://flagcdn.com/w160/jp.png',
  AUS: 'https://flagcdn.com/w160/au.png', CHN: 'https://flagcdn.com/w160/cn.png',
  NED: 'https://flagcdn.com/w160/nl.png', CRO: 'https://flagcdn.com/w160/hr.png',
  KOR: 'https://flagcdn.com/w160/kr.png', JAM: 'https://flagcdn.com/w160/jm.png',
  BEL: 'https://flagcdn.com/w160/be.png', ITA: 'https://flagcdn.com/w160/it.png',
  USA: 'https://flagcdn.com/w160/us.png', HAI: 'https://flagcdn.com/w160/ht.png',
  URU: 'https://flagcdn.com/w160/uy.png', COL: 'https://flagcdn.com/w160/co.png',
  PAN: 'https://flagcdn.com/w160/pa.png', VEN: 'https://flagcdn.com/w160/ve.png',
  SEN: 'https://flagcdn.com/w160/sn.png', ALG: 'https://flagcdn.com/w160/dz.png',
  NGA: 'https://flagcdn.com/w160/ng.png', GAM: 'https://flagcdn.com/w160/gm.png',
  SUI: 'https://flagcdn.com/w160/ch.png', SWE: 'https://flagcdn.com/w160/se.png',
  CMR: 'https://flagcdn.com/w160/cm.png', QAT: 'https://flagcdn.com/w160/qa.png',
  AUT: 'https://flagcdn.com/w160/at.png', TUR: 'https://flagcdn.com/w160/tr.png',
  POL: 'https://flagcdn.com/w160/pl.png', BIH: 'https://flagcdn.com/w160/ba.png',
  UKR: 'https://flagcdn.com/w160/ua.png', SRB: 'https://flagcdn.com/w160/rs.png',
  ROU: 'https://flagcdn.com/w160/ro.png', LTU: 'https://flagcdn.com/w160/lt.png',
}

function getTeamFlagUrl(code: string): string {
  return teamFlags[code] || ''
}

export default function MatchCard({ match, isSelected, prediction, onPredict, onShare, onSelect }: MatchCardProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [activeTab, setActiveTab] = useState<'mine' | 'ranking'>('mine')
  const [loading, setLoading] = useState(false)
  const [showTeamA, setShowTeamA] = useState(false)
  const [showTeamB, setShowTeamB] = useState(false)

  useEffect(() => {
    if (isSelected) {
      loadPredictionData()
    }
  }, [isSelected, match.id])

  const loadPredictionData = async () => {
    setLoading(true)
    try {
      const [predData, rankData] = await Promise.all([
        getUserPredictions(),
        getLeaderboard(10)
      ])
      setPredictions(predData)
      setLeaderboard(rankData)
    } catch (err) {
      console.error('Failed to load prediction data:', err)
    } finally {
      setLoading(false)
    }
  }

  const getPredictionLabel = (winner: string) => {
    if (winner === 'draw') return '平局'
    if (winner === match.team_a_code) return match.team_a
    if (winner === match.team_b_code) return match.team_b
    return winner
  }

  const getBadgeClass = (winner: string) => {
    if (winner === 'draw') return 'badge-draw'
    if (winner === match.team_a_code) return 'badge-teamA'
    if (winner === match.team_b_code) return 'badge-teamB'
    return ''
  }

  // 计算显示百分比（确保显示两位小数以上）
  const displayPercent = (value: number) => {
    return Math.max(1, value) // 至少显示 1%
  }

  return (
    <>
      <div className={`match-card ${isSelected ? 'selected' : ''}`} onClick={() => onSelect?.(match.id)}>
        {/* 球队对阵区域 */}
        <div className="match-header">
          <div className="team team-a">
            {getTeamFlagUrl(match.team_a_code) && (
              <img className="team-flag-img" src={getTeamFlagUrl(match.team_a_code)} alt={match.team_a} loading="lazy" />
            )}
            <span className="team-name" onClick={(e) => { e.stopPropagation(); setShowTeamA(true); }}>
              {match.team_a}
              <span className="team-hint">👤</span>
            </span>
          </div>
          <div className="match-vs">VS</div>
          <div className="team team-b">
            <span className="team-name" onClick={(e) => { e.stopPropagation(); setShowTeamB(true); }}>
              <span className="team-hint">👤</span>
              {match.team_b}
            </span>
            {getTeamFlagUrl(match.team_b_code) && (
              <img className="team-flag-img" src={getTeamFlagUrl(match.team_b_code)} alt={match.team_b} loading="lazy" />
            )}
          </div>
        </div>

        <div className="match-meta">
          <span className="match-time">🕐 {match.time}</span>
          <span className="match-venue">📍 {match.venue}</span>
          {match.stage === 'group' && <span className="match-group">🏆 {match.group}组</span>}
        </div>

        {/* 选中后显示完整内容 */}
        {isSelected && (
          <div className="match-content" onClick={e => e.stopPropagation()}>
            {/* 预测分析 - 显示完整百分比 */}
            {prediction && (
              <div className="prediction-analysis">
                <div className="prob-bar">
                  <div className="prob-fill win" style={{ width: `${prediction.win_probability.team_a}%` }}>
                    <span className="prob-value">{displayPercent(prediction.win_probability.team_a)}%</span>
                  </div>
                  <div className="prob-fill draw" style={{ width: `${prediction.win_probability.draw}%` }}>
                    <span className="prob-value">{displayPercent(prediction.win_probability.draw)}%</span>
                  </div>
                  <div className="prob-fill lose" style={{ width: `${prediction.win_probability.team_b}%` }}>
                    <span className="prob-value">{displayPercent(prediction.win_probability.team_b)}%</span>
                  </div>
                </div>

                <div className="prob-labels">
                  <span className="prob-label win">{match.team_a}</span>
                  <span className="prob-label draw">平局</span>
                  <span className="prob-label lose">{match.team_b}</span>
                </div>

                <div className="strength-rating">
                  <span className="strength-label">🏆 综合评分</span>
                  <span className="strength-value">{prediction.strength_rating.team_a}</span>
                  <span className="strength-sep">-</span>
                  <span className="strength-value">{prediction.strength_rating.team_b}</span>
                </div>

                {prediction.historic_score && (
                  <div className="score-details">
                    <div className="score-detail">
                      <span className="detail-label">📊 历史分</span>
                      <span>{prediction.historic_score.team_a} - {prediction.historic_score.team_b}</span>
                    </div>
                    <div className="score-detail">
                      <span className="detail-label">⭐ 球员分</span>
                      <span>{prediction.squad_score?.team_a} - {prediction.squad_score?.team_b}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 切换 */}
            <div className="card-tabs">
              <button className={`card-tab ${activeTab === 'mine' ? 'active' : ''}`} onClick={() => setActiveTab('mine')}>
                我的预测 ({predictions.length})
              </button>
              <button className={`card-tab ${activeTab === 'ranking' ? 'active' : ''}`} onClick={() => setActiveTab('ranking')}>
                🏅 排行榜
              </button>
            </div>

            <div className="card-data">
              {activeTab === 'mine' ? (
                <div className="predictions-mini-list">
                  {loading ? (
                    <div className="mini-loading">加载中...</div>
                  ) : predictions.length === 0 ? (
                    <div className="mini-empty">暂无预测记录，提交预测成为第一个！</div>
                  ) : (
                    predictions.slice(0, 10).map((pred, i) => (
                      <div key={pred.id} className="pred-mini-item">
                        <span className="pred-mini-nick">{pred.nickname}</span>
                        <span className={`pred-mini-badge ${getBadgeClass(pred.predicted_winner)}`}>
                          {getPredictionLabel(pred.predicted_winner)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="ranking-mini-list">
                  {loading ? (
                    <div className="mini-loading">加载中...</div>
                  ) : leaderboard.length === 0 ? (
                    <div className="mini-empty">暂无排行数据</div>
                  ) : (
                    leaderboard.slice(0, 10).map((entry, i) => (
                      <div key={entry.device_id} className="rank-mini-item">
                        <span className="rank-mini-pos">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
                        <span className="rank-mini-nick">{entry.nickname}</span>
                        <span className="rank-mini-stats">
                          {Math.round(entry.correct_count / entry.total_count * 100)}%
                          {entry.current_streak > 0 && ` 🔥${entry.current_streak}`}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="match-actions">
              <button className="btn-predict" onClick={() => onPredict?.(match.id)}>📝 预测</button>
              <button className="btn-share" onClick={() => onShare?.(match.id)}>🔗 分享</button>
            </div>
          </div>
        )}

        {!isSelected && <div className="match-hint">⚽ 点击查看预测详情</div>}
      </div>

      {/* 球队详情弹窗 */}
      {showTeamA && (
        <TeamModal 
          teamCode={match.team_a_code} 
          teamName={match.team_a}
          onClose={() => setShowTeamA(false)} 
        />
      )}
      {showTeamB && (
        <TeamModal 
          teamCode={match.team_b_code} 
          teamName={match.team_b}
          onClose={() => setShowTeamB(false)} 
        />
      )}
    </>
  )
}
