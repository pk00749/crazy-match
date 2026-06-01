import { useState, useEffect } from 'react'
import { getMatches, getTeams, getPrediction } from '../api'
import type { Team, Match, Prediction } from '../api'
import MatchCard from '../components/MatchCard'
import DatePicker from '../components/DatePicker'

export default function TodayPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Record<string, Team>>({})
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({})
  const [loading, setLoading] = useState(true)
  const [model, setModel] = useState<'historic' | 'squad'>('squad')

  useEffect(() => {
    async function loadData() {
      try {
        const [matchesData, teamsData] = await Promise.all([
          getMatches({ date: selectedDate }),
          getTeams()
        ])

        setMatches(matchesData)
        const teamsMap: Record<string, Team> = {}
        teamsData.forEach((t: Team) => teamsMap[t.code] = t)
        setTeams(teamsMap)

        // Load predictions
        const preds: Record<string, Prediction> = {}
        for (const match of matchesData) {
          try {
            preds[match.id] = await getPrediction(match.id)
          } catch (e) {
            console.error('Failed to load prediction for', match.id, e)
          }
        }
        setPredictions(preds)
      } catch (e) {
        console.error('Failed to load data:', e)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [selectedDate, model])

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  return (
    <div className="today-page">
      <div className="date-section">
        <DatePicker value={selectedDate} onChange={setSelectedDate} />
        <div className="model-toggle">
          <button
            className={model === 'historic' ? 'active' : ''}
            onClick={() => setModel('historic')}
          >
            历史战绩
          </button>
          <button
            className={model === 'squad' ? 'active' : ''}
            onClick={() => setModel('squad')}
          >
            球员实力
          </button>
        </div>
      </div>

      <div className="matches-list">
        {matches.length === 0 ? (
          <div className="no-matches">当日无比赛</div>
        ) : (
          matches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              teamA={teams[match.team_a]}
              teamB={teams[match.team_b]}
              prediction={predictions[match.id]}
            />
          ))
        )}
      </div>
    </div>
  )
}