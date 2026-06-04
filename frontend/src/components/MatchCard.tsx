import { useState } from 'react'

interface Prediction {
  win_probability: { team_a: number; team_b: number; draw: number }
  strength_rating: { team_a: number; team_b: number }
  historic_score?: { team_a: number; team_b: number }
  squad_score?: { team_a: number; team_b: number }
}

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
  prediction?: Prediction
  onPredict?: (matchId: string) => void
  onShare?: (matchId: string) => void
  onSelect?: (matchId: string) => void
}

const teamFlags: Record<string, string> = {
  ARG: 'https://flagcdn.com/w80/ar.png', MEX: 'https://flagcdn.com/w80/mx.png',
  CAN: 'https://flagcdn.com/w80/ca.png', GUA: 'https://flagcdn.com/w80/gt.png',
  ESP: 'https://flagcdn.com/w80/es.png', BRA: 'https://flagcdn.com/w80/br.png',
  ECU: 'https://flagcdn.com/w80/ec.png', PAR: 'https://flagcdn.com/w80/py.png',
  FRA: 'https://flagcdn.com/w80/fr.png', EGY: 'https://flagcdn.com/w80/eg.png',
  NZL: 'https://flagcdn.com/w80/nz.png', VAN: 'https://flagcdn.com/w80/vu.png',
  ENG: 'https://flagcdn.com/w80/gb.png', POR: 'https://flagcdn.com/w80/pt.png',
  MAR: 'https://flagcdn.com/w80/ma.png', MAS: 'https://flagcdn.com/w80/my.png',
  GER: 'https://flagcdn.com/w80/de.png', JPN: 'https://flagcdn.com/w80/jp.png',
  AUS: 'https://flagcdn.com/w80/au.png', CHN: 'https://flagcdn.com/w80/cn.png',
  NED: 'https://flagcdn.com/w80/nl.png', CRO: 'https://flagcdn.com/w80/hr.png',
  KOR: 'https://flagcdn.com/w80/kr.png', JAM: 'https://flagcdn.com/w80/jm.png',
  BEL: 'https://flagcdn.com/w80/be.png', ITA: 'https://flagcdn.com/w80/it.png',
  USA: 'https://flagcdn.com/w80/us.png', HAI: 'https://flagcdn.com/w80/ht.png',
  URU: 'https://flagcdn.com/w80/uy.png', COL: 'https://flagcdn.com/w80/co.png',
  PAN: 'https://flagcdn.com/w80/pa.png', VEN: 'https://flagcdn.com/w80/ve.png',
  SEN: 'https://flagcdn.com/w80/sn.png', ALG: 'https://flagcdn.com/w80/dz.png',
  NGA: 'https://flagcdn.com/w80/ng.png', GAM: 'https://flagcdn.com/w80/gm.png',
  SUI: 'https://flagcdn.com/w80/ch.png', SWE: 'https://flagcdn.com/w80/se.png',
  CMR: 'https://flagcdn.com/w80/cm.png', QAT: 'https://flagcdn.com/w80/qa.png',
  AUT: 'https://flagcdn.com/w80/at.png', TUR: 'https://flagcdn.com/w80/tr.png',
  POL: 'https://flagcdn.com/w80/pl.png', BIH: 'https://flagcdn.com/w80/ba.png',
  UKR: 'https://flagcdn.com/w80/ua.png', SRB: 'https://flagcdn.com/w80/rs.png',
  ROU: 'https://flagcdn.com/w80/ro.png', LTU: 'https://flagcdn.com/w80/lt.png',
}

function getTeamFlagUrl(code: string): string {
  return teamFlags[code] || ''
}

export default function MatchCard({ match, isSelected, prediction, onPredict, onShare, onSelect }: MatchCardProps) {
  const handleClick = () => {
    onSelect?.(match.id)
  }

  return (
    <div 
      className={`match-card ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <div className="match-header">
        <div className="team team-a">
          {getTeamFlagUrl(match.team_a_code) && (
            <img className="team-flag-img" src={getTeamFlagUrl(match.team_a_code)} alt={match.team_a} loading="lazy" />
          )}
          <span className="team-name">{match.team_a}</span>
        </div>
        <div className="match-vs">VS</div>
        <div className="team team-b">
          <span className="team-name">{match.team_b}</span>
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

      {isSelected && prediction && (
        <div className="prediction-summary" onClick={(e) => e.stopPropagation()}>
          <div className="prob-bar">
            <div className="prob-fill win" style={{ width: `${prediction.win_probability.team_a}%` }}>
              {prediction.win_probability.team_a >= 8 && <span>{prediction.win_probability.team_a}%</span>}
            </div>
            <div className="prob-fill draw" style={{ width: `${prediction.win_probability.draw}%` }}>
              {prediction.win_probability.draw >= 8 && <span>{prediction.win_probability.draw}%</span>}
            </div>
            <div className="prob-fill lose" style={{ width: `${prediction.win_probability.team_b}%` }}>
              {prediction.win_probability.team_b >= 8 && <span>{prediction.win_probability.team_b}%</span>}
            </div>
          </div>

          <div className="prob-labels">
            <span className="prob-label win">{match.team_a} 胜</span>
            <span className="prob-label draw">平</span>
            <span className="prob-label lose">{match.team_b} 胜</span>
          </div>

          <div className="strength-rating">
            <div className="strength-item">
              <span className="strength-label">综合评分</span>
              <span className="strength-value">{prediction.strength_rating.team_a}</span>
              <span className="strength-sep">-</span>
              <span className="strength-value">{prediction.strength_rating.team_b}</span>
            </div>
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

          <div className="match-actions">
            <button className="btn-predict" onClick={() => onPredict?.(match.id)}>📝 预测</button>
            <button className="btn-share" onClick={() => onShare?.(match.id)}>🔗 分享</button>
          </div>
        </div>
      )}

      {!isSelected && <div className="match-hint">点击查看预测</div>}
    </div>
  )
}
