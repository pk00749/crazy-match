import { useState, useEffect, useCallback } from 'react'
import MatchCard from '../components/MatchCard'
import PredictionForm from '../components/PredictionForm'
import { matchesApi, teamsApi, predictApi } from '../api'

export default function TodayPage() {
  const [selectedDate, setSelectedDate] = useState(new Date(Math.max(new Date("2026-06-12").getTime(), new Date().getTime())))
  const [matches, setMatches] = useState<any[]>([])
  const [predictions, setPredictions] = useState<Record<string, any>>({})
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPredictionForm, setShowPredictionForm] = useState<string | null>(null)

  const loadMatches = useCallback(async () => {
    setLoading(true)
    setSelectedMatchId(null)
    try {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const data = matchesApi.getByDate(dateStr)
      setMatches(data || [])

      const preds: Record<string, any> = {}
      for (const match of data || []) {
        try {
          preds[match.id] = predictApi.getByMatch(match.id)
        } catch (e) { /* silent */ }
      }
      setPredictions(preds)
      
      if (data && data.length > 0) {
        setSelectedMatchId(data[0].id)
      }
    } catch (err) {
      console.error('Failed to load matches:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedDate])

  useEffect(() => { loadMatches() }, [loadMatches])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })
  }

  const prevDay = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() - 1)
    setSelectedDate(d)
  }

  const nextDay = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + 1)
    setSelectedDate(d)
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">📅 今日赛程</h2>
        <span className="page-meta">{matches.length} 场比赛</span>
      </div>

      <div className="date-nav">
        <button className="date-nav-btn" onClick={prevDay}>←</button>
        <span className="date-display">{formatDate(selectedDate)}</span>
        <button className="date-nav-btn" onClick={nextDay}>→</button>
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-ball">⚽</div>
          加载中...
        </div>
      ) : matches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <p className="empty-text">当天没有比赛安排</p>
        </div>
      ) : (
        <div className="matches-list">
          {matches.map(match => {
            const teamA = teamsApi.getById(match.team_a)
            const teamB = teamsApi.getById(match.team_b)
            const nameA = teamA?.name || match.team_a
            const nameB = teamB?.name || match.team_b
            return (
              <MatchCard
                key={match.id}
                match={{
                  id: match.id,
                  team_a: nameA,
                  team_b: nameB,
                  team_a_code: match.team_a,
                  team_b_code: match.team_b,
                  time: match.time,
                  venue: match.venue,
                  city: match.city,
                  date: match.date,
                  stage: match.stage,
                  group: match.group,
                  score_a: match.score_a,
                  score_b: match.score_b,
                }}
                isSelected={selectedMatchId === match.id}
                prediction={predictions[match.id]}
                onSelect={setSelectedMatchId}
                onPredict={(id) => setShowPredictionForm(id)}
              />
            )
          })}
        </div>
      )}

      {showPredictionForm && (() => {
        const m = matches.find(x => x.id === showPredictionForm)
        const teamA = teamsApi.getById(m?.team_a)
        const teamB = teamsApi.getById(m?.team_b)
        return (
          <PredictionForm
            matchId={showPredictionForm}
            teamACode={m?.team_a || ''}
            teamAName={teamA?.name || m?.team_a || ''}
            teamBCode={m?.team_b || ''}
            teamBName={teamB?.name || m?.team_b || ''}
            onClose={() => setShowPredictionForm(null)}
            onSuccess={loadMatches}
          />
        )
      })()}
    </div>
  )
}
