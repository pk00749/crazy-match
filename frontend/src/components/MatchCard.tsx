import type { Team, Match, Prediction } from '../api'

interface Props {
  match: Match
  teamA?: Team
  teamB?: Team
  prediction?: Prediction
}

export default function MatchCard({ match, teamA, teamB, prediction }: Props) {
  const formatDate = (date: string) => {
    const d = new Date(date)
    return `${d.getMonth() + 1}月${d.getDate()}日`
  }

  return (
    <div className="match-card">
      <div className="match-header">
        <span className="match-date">{formatDate(match.date)} {match.time}</span>
        <span className="match-venue">{match.venue} · {match.city}</span>
      </div>

      <div className="match-teams">
        <div className="team">
          <span className="team-flag">{teamA?.flag || '🏳️'}</span>
          <span className="team-name">{teamA?.name || match.team_a}</span>
        </div>

        <div className="vs">VS</div>

        <div className="team">
          <span className="team-flag">{teamB?.flag || '🏳️'}</span>
          <span className="team-name">{teamB?.name || match.team_b}</span>
        </div>
      </div>

      {prediction && (
        <div className="prediction-section">
          <div className="win-prob">
            <span>{prediction.win_probability[match.team_a] || 0}%</span>
            <span className="prob-label">胜率</span>
            <span>{prediction.win_probability[match.team_b] || 0}%</span>
          </div>
          <div className="strength-rating">
            <span>实力: {prediction.strength_rating[match.team_a] || 0}</span>
            <span>vs</span>
            <span>{prediction.strength_rating[match.team_b] || 0}</span>
          </div>
        </div>
      )}
    </div>
  )
}