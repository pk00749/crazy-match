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

const teamFlags: Record<string, string> = {
  ARG: 'https://flagcdn.com/w320/ar.png', MEX: 'https://flagcdn.com/w320/mx.png',
  CAN: 'https://flagcdn.com/w320/ca.png', GUA: 'https://flagcdn.com/w320/gt.png',
  ESP: 'https://flagcdn.com/w320/es.png', BRA: 'https://flagcdn.com/w320/br.png',
  ECU: 'https://flagcdn.com/w320/ec.png', PAR: 'https://flagcdn.com/w320/py.png',
  FRA: 'https://flagcdn.com/w320/fr.png', EGY: 'https://flagcdn.com/w320/eg.png',
  NZL: 'https://flagcdn.com/w320/nz.png', VAN: 'https://flagcdn.com/w320/vu.png',
  ENG: 'https://flagcdn.com/w320/gb.png', POR: 'https://flagcdn.com/w320/pt.png',
  MAR: 'https://flagcdn.com/w320/ma.png', MAS: 'https://flagcdn.com/w320/my.png',
  GER: 'https://flagcdn.com/w320/de.png', JPN: 'https://flagcdn.com/w320/jp.png',
  AUS: 'https://flagcdn.com/w320/au.png', CHN: 'https://flagcdn.com/w320/cn.png',
  NED: 'https://flagcdn.com/w320/nl.png', CRO: 'https://flagcdn.com/w320/hr.png',
  KOR: 'https://flagcdn.com/w320/kr.png', JAM: 'https://flagcdn.com/w320/jm.png',
  BEL: 'https://flagcdn.com/w320/be.png', ITA: 'https://flagcdn.com/w320/it.png',
  USA: 'https://flagcdn.com/w320/us.png', HAI: 'https://flagcdn.com/w320/ht.png',
  URU: 'https://flagcdn.com/w320/uy.png', COL: 'https://flagcdn.com/w320/co.png',
  PAN: 'https://flagcdn.com/w320/pa.png', VEN: 'https://flagcdn.com/w320/ve.png',
  SEN: 'https://flagcdn.com/w320/sn.png', ALG: 'https://flagcdn.com/w320/dz.png',
  NGA: 'https://flagcdn.com/w320/ng.png', GAM: 'https://flagcdn.com/w320/gm.png',
  SUI: 'https://flagcdn.com/w320/ch.png', SWE: 'https://flagcdn.com/w320/se.png',
  CMR: 'https://flagcdn.com/w320/cm.png', QAT: 'https://flagcdn.com/w320/qa.png',
  AUT: 'https://flagcdn.com/w320/at.png', TUR: 'https://flagcdn.com/w320/tr.png',
  POL: 'https://flagcdn.com/w320/pl.png', BIH: 'https://flagcdn.com/w320/ba.png',
  UKR: 'https://flagcdn.com/w320/ua.png', SRB: 'https://flagcdn.com/w320/rs.png',
  ROU: 'https://flagcdn.com/w320/ro.png', LTU: 'https://flagcdn.com/w320/lt.png',
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
          <span className="player-sep">•</span>
          <span className="player-age">{player.age}岁</span>
          <span className="player-sep">•</span>
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
          {teamFlags[teamCode] && (
            <img className="team-modal-flag" src={teamFlags[teamCode]} alt={teamName} />
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
