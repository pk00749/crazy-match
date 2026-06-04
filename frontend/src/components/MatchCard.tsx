import { useState } from 'react'

interface MatchCardProps {
  match: {
    id: string
    team_a: string
    team_b: string
    time: string
    venue: string
  }
  prediction?: {
    win_probability: { team_a: number; team_b: number; draw: number }
    strength_rating: { team_a: number; team_b: number }
  }
  onPredict?: (matchId: string) => void
  onShare?: (matchId: string) => void
}

const teamFlags: Record<string, string> = {
  ARG: '🇦🇷', MEX: '🇲🇽', CAN: '🇨🇦', GUA: '🇬🇹',
  ESP: '🇪🇸', BRA: '🇧🇷', ECU: '🇪🇨', PAR: '🇵🇾',
  FRA: '🇫🇷', EGY: '🇪🇬', NZL: '🇳🇿', VAN: '🇻🇺',
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', POR: '🇵🇹', MAR: '🇲🇦', MAS: '🇲🇾',
  GER: '🇩🇪', JPN: '🇯🇵', AUS: '🇦🇺', CHN: '🇨🇳',
  NED: '🇳🇱', CRO: '🇭🇷', KOR: '🇰🇷', JAM: '🇯🇲',
  BEL: '🇧🇪', ITA: '🇮🇹', USA: '🇺🇸', HAI: '🇭🇹',
  URU: '🇺🇾', COL: '🇨🇴', PAN: '🇵🇦', VEN: '🇻🇪',
  SEN: '🇸🇳', ALG: '🇩🇿', NGA: '🇳🇬', GAM: '🇬🇲',
  SUI: '🇨🇭', SWE: '🇸🇪', CMR: '🇨🇲', QAT: '🇶🇦',
  AUT: '🇦🇹', TUR: '🇹🇷', POL: '🇵🇱', BIH: '🇧🇦',
  UKR: '🇺🇦', SRB: '🇷🇸', ROU: '🇷🇴', LTU: '🇱🇹',
  // Placeholder teams for knockout stage
  A1: '❓', A2: '❓', B1: '❓', B2: '❓', C1: '❓', C2: '❓',
  D1: '❓', D2: '❓', E1: '❓', E2: '❓', F1: '❓', F2: '❓',
  G1: '❓', G2: '❓', H1: '❓', H2: '❓', I1: '❓', I2: '❓',
  J1: '❓', J2: '❓', K1: '❓', K2: '❓', L1: '❓', L2: '❓',
}

function getTeamFlag(teamCode: string): string {
  return teamFlags[teamCode] || '🏳️'
}

export default function MatchCard({ match, prediction, onPredict, onShare }: MatchCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="match-card">
      <div className="match-header" onClick={() => setExpanded(!expanded)}>
        <div className="team team-a">
          <span className="team-flag">{getTeamFlag(match.team_a)}</span>
          <span className="team-name">{match.team_a}</span>
        </div>
        <div className="match-vs">VS</div>
        <div className="team team-b">
          <span className="team-name">{match.team_b}</span>
          <span className="team-flag">{getTeamFlag(match.team_b)}</span>
        </div>
      </div>

      <div className="match-meta">
        <span className="match-time">{match.time}</span>
        <span className="match-venue">{match.venue}</span>
      </div>

      {prediction && (
        <div className="prediction-summary">
          <div className="prediction-bar">
            <span className="prediction-team prediction-team-a">{match.team_a}</span>
            <div className="prob-bar">
              <div className="prob-fill win" style={{ width: `${prediction.win_probability.team_a}%` }} />
              <div className="prob-fill draw" style={{ width: `${prediction.win_probability.draw}%` }} />
              <div className="prob-fill lose" style={{ width: `${prediction.win_probability.team_b}%` }} />
            </div>
            <span className="prediction-team prediction-team-b">{match.team_b}</span>
          </div>
          <div className="prob-values" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span className="prob-value win">{prediction.win_probability.team_a}%</span>
            <span className="prob-value draw">{prediction.win_probability.draw}%</span>
            <span className="prob-value lose">{prediction.win_probability.team_b}%</span>
          </div>
          <div className="strength-rating">
            <span>实力:</span>
            <span className="strength-value">{prediction.strength_rating.team_a}</span>
            <span>vs</span>
            <span className="strength-value">{prediction.strength_rating.team_b}</span>
          </div>
        </div>
      )}

      {expanded && (
        <div className="match-actions">
          <button className="btn-predict" onClick={() => onPredict?.(match.id)}>预测</button>
          <button className="btn-share" onClick={() => onShare?.(match.id)}>分享</button>
        </div>
      )}
    </div>
  )
}
