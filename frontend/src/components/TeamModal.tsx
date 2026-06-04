import { useState, useEffect } from 'react'
import { teamsApi } from '../api'

interface Player {
  id: string
  name: string
  position: string
  age: number
  club: string
  rating: number
}

interface TeamData {
  id: string
  name: string
  code: string
  flag: string
  fifa_rank: number
  group: string
  strengthScore: number
  historicRecord?: {
    appearances: number
    titles: number
    winRate: number
  }
  currentSquad?: Player[]
}

// 3-letter team code -> 2-letter ISO flag code (flagcdn.com)
const flagCodeMap: Record<string, string> = {
  ALG:'dz', ARG:'ar', AUS:'au', AUT:'at', BEL:'be', BIH:'ba', BRA:'br', CAN:'ca',
  CHI:'cl', CMR:'cm', COL:'co', CRO:'hr', ECU:'ec', EGY:'eg', ENG:'gb-eng',
  ESP:'es', FRA:'fr', GER:'de', GHA:'gh', HUN:'hu', INA:'id', IRL:'ie',
  IRN:'ir', ITA:'it', JPN:'jp', KOR:'kr', KSA:'sa', MAR:'ma', MEX:'mx',
  NED:'nl', NGA:'ng', NOR:'no', NZL:'nz', PAR:'py', PER:'pe', POL:'pl',
  POR:'pt', QAT:'qa', ROU:'ro', RSA:'za', SEN:'sn', SRB:'rs', SUI:'ch',
  UAE:'ae', URU:'uy', USA:'us', VEN:'ve', WAL:'gb-wls',
}

function getFlagUrl(code: string): string {
  const mapped = flagCodeMap[code]
  return mapped ? `https://flagcdn.com/w320/${mapped}.png` : ''
}

const positionColors: Record<string, string> = {
  GK: '#f59e0b',  // 门将 - 黄色
  DEF: '#3b82f6', // 后卫 - 蓝色
  MID: '#22c55e', // 中场 - 绿色
  FWD: '#ef4444', // 前锋 - 红色
}

const positionLabels: Record<string, string> = {
  GK: '门将',
  DEF: '后卫',
  MID: '中场',
  FWD: '前锋',
}

interface TeamModalProps {
  teamCode: string
  teamName: string
  onClose: () => void
}

export default function TeamModal({ teamCode, teamName, onClose }: TeamModalProps) {
  const [team, setTeam] = useState<TeamData | null>(null)
  const [activeTab, setActiveTab] = useState<'squad' | 'stats'>('squad')

  useEffect(() => {
    loadTeamData()
  }, [teamCode])

  const loadTeamData = () => {
    const teamData = teamsApi.getById(teamCode)
    if (teamData) {
      setTeam(teamData as unknown as TeamData)
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 85) return '#ef4444' // 红 - 世界级
    if (rating >= 80) return '#f59e0b' // 橙 - 优秀
    if (rating >= 75) return '#22c55e' // 绿 - 良好
    return '#94a3b8' // 灰 - 一般
  }

  const renderPlayerCard = (player: Player, index: number) => (
    <div key={player.id} className="player-card" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="player-rank" style={{ background: positionColors[player.position] || '#94a3b8' }}>
        {index + 1}
      </div>
      <div className="player-info">
        <div className="player-name">{player.name}</div>
        <div className="player-meta">
          <span className="player-pos">{positionLabels[player.position] || player.position}</span>
          <span className="player-sep">·</span>
          <span className="player-age">{player.age}岁</span>
          <span className="player-sep">·</span>
          <span className="player-club">{player.club}</span>
        </div>
      </div>
      <div className="player-rating" style={{ color: getRatingColor(player.rating) }}>
        {player.rating}
      </div>
    </div>
  )

  return (
    <div className="team-modal-overlay" onClick={onClose}>
      <div className="team-modal" onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div className="team-modal-header">
          {getFlagUrl(teamCode) && (
            <img className="team-modal-flag" src={getFlagUrl(teamCode)} alt={teamName} />
          )}
          <div className="team-modal-info">
            <h2 className="team-modal-name">{teamName}</h2>
            <div className="team-modal-meta">
              <span className="meta-item">🏆 {team?.group}组</span>
              <span className="meta-item">📊 FIFA排名 #{team?.fifa_rank || '-'}</span>
              <span className="meta-item">⭐ 综合评分 {team?.strengthScore || '-'}</span>
            </div>
          </div>
          <button className="team-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Tab 切换 */}
        <div className="team-modal-tabs">
          <button className={`team-tab ${activeTab === 'squad' ? 'active' : ''}`} onClick={() => setActiveTab('squad')}>
            👥 阵容 ({team?.currentSquad?.length || 0})
          </button>
          <button className={`team-tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
            📈 战绩
          </button>
        </div>

        {/* 内容 */}
        <div className="team-modal-content">
          {activeTab === 'squad' ? (
            <div className="squad-list">
              {team?.currentSquad ? (
                <>
                  {/* 门将 */}
                  {team.currentSquad.filter(p => p.position === 'GK').length > 0 && (
                    <div className="squad-section">
                      <div className="squad-section-title" style={{ borderLeft: `4px solid ${positionColors.GK}` }}>
                        🧤 门将
                      </div>
                      {team.currentSquad.filter(p => p.position === 'GK').map((p, i) => renderPlayerCard(p, i))}
                    </div>
                  )}
                  {/* 后卫 */}
                  {team.currentSquad.filter(p => p.position === 'DEF').length > 0 && (
                    <div className="squad-section">
                      <div className="squad-section-title" style={{ borderLeft: `4px solid ${positionColors.DEF}` }}>
                        🛡️ 后卫
                      </div>
                      {team.currentSquad.filter(p => p.position === 'DEF').map((p, i) => renderPlayerCard(p, i))}
                    </div>
                  )}
                  {/* 中场 */}
                  {team.currentSquad.filter(p => p.position === 'MID').length > 0 && (
                    <div className="squad-section">
                      <div className="squad-section-title" style={{ borderLeft: `4px solid ${positionColors.MID}` }}>
                        🎯 中场
                      </div>
                      {team.currentSquad.filter(p => p.position === 'MID').map((p, i) => renderPlayerCard(p, i))}
                    </div>
                  )}
                  {/* 前锋 */}
                  {team.currentSquad.filter(p => p.position === 'FWD').length > 0 && (
                    <div className="squad-section">
                      <div className="squad-section-title" style={{ borderLeft: `4px solid ${positionColors.FWD}` }}>
                        ⚽ 前锋
                      </div>
                      {team.currentSquad.filter(p => p.position === 'FWD').map((p, i) => renderPlayerCard(p, i))}
                    </div>
                  )}
                </>
              ) : (
                <div className="squad-empty">暂无球员数据</div>
              )}
            </div>
          ) : (
            <div className="stats-list">
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <div className="stat-value">{team?.historicRecord?.titles || 0}</div>
                  <div className="stat-label">世界杯冠军</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <div className="stat-value">{team?.historicRecord?.appearances || 0}</div>
                  <div className="stat-label">参赛次数</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <div className="stat-value">{team?.historicRecord?.winRate || 0}%</div>
                  <div className="stat-label">历史胜率</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
