import { useState, useEffect } from 'react'
import DatePicker from '../components/DatePicker'
import MatchCard from '../components/MatchCard'
import Leaderboard from '../components/Leaderboard'
import PredictionForm from '../components/PredictionForm'
import { matchesApi, teamsApi, predictApi } from '../api'

export default function TodayPage() {
  // Default to June 11, 2026 - first match day
  const [selectedDate, setSelectedDate] = useState(new Date('2026-06-11'))
  const [matches, setMatches] = useState<any[]>([])
  const [predictions, setPredictions] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [showPredictionForm, setShowPredictionForm] = useState<string | null>(null)

  useEffect(() => {
    loadMatches()
  }, [selectedDate])

  const loadMatches = async () => {
    setLoading(true)
    try {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const data = matchesApi.getByDate(dateStr)
      setMatches(data || [])

      // Load predictions for each match
      const preds: Record<string, any> = {}
      for (const match of data || []) {
        try {
          preds[match.id] = predictApi.getByMatch(match.id)
        } catch (e) {
          console.error('Failed to get prediction for match', match.id, e)
        }
      }
      setPredictions(preds)
    } catch (err) {
      console.error('Failed to load matches:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = (matchId: string) => {
    const match = matches.find(m => m.id === matchId)
    if (match) {
      const link = `${window.location.origin}/share/${matchId}`
      navigator.clipboard.writeText(link)
      alert('分享链接已复制！')
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getMatchCount = () => {
    const dateStr = selectedDate.toISOString().split('T')[0]
    return matchesApi.getByDate(dateStr).length
  }

  return (
    <div className="today-page">
      <div className="today-header">
        <div>
          <h2>{formatDate(selectedDate)}</h2>
          <span className="today-date-badge">共 {getMatchCount()} 场比赛</span>
        </div>
        <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : matches.length === 0 ? (
        <div className="no-matches">
          <p>📅 当天没有比赛</p>
          <p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--text-muted)' }}>
            2026世界杯小组赛：6月11日-6月27日
          </p>
        </div>
      ) : (
        <div className="matches-list">
          {matches.map(match => {
            const teamA = teamsApi.getById(match.team_a)
            const teamB = teamsApi.getById(match.team_b)
            return (
              <MatchCard
                key={match.id}
                match={{
                  ...match,
                  team_a: teamA?.name || match.team_a,
                  team_b: teamB?.name || match.team_b
                }}
                prediction={predictions[match.id]}
                onPredict={(id) => setShowPredictionForm(id)}
                onShare={handleShare}
              />
            )
          })}
        </div>
      )}

      <div className="leaderboard-section">
        <Leaderboard />
      </div>

      {showPredictionForm && (
        <PredictionForm
          matchId={showPredictionForm}
          teamAName={matches.find(m => m.id === showPredictionForm)?.team_a || ''}
          teamBName={matches.find(m => m.id === showPredictionForm)?.team_b || ''}
          onClose={() => setShowPredictionForm(null)}
        />
      )}
    </div>
  )
}
