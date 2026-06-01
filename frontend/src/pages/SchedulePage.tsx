import { useState, useEffect } from 'react'
import { getMatches, getTeams } from '../api'
import type { Team, Match } from '../api'
import MatchCard from '../components/MatchCard'

type Stage = 'group' | 'round16' | 'quarter' | 'semi' | 'final'

const STAGE_LABELS: Record<Stage, string> = {
  group: '小组赛',
  round16: '16强',
  quarter: '8强',
  semi: '4强',
  final: '决赛'
}

export default function SchedulePage() {
  const [stage, setStage] = useState<Stage>('group')
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Record<string, Team>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [matchesData, teamsData] = await Promise.all([
          getMatches({ stage }),
          getTeams()
        ])

        setMatches(matchesData)
        const teamsMap: Record<string, Team> = {}
        teamsData.forEach((t: Team) => teamsMap[t.code] = t)
        setTeams(teamsMap)
      } catch (e) {
        console.error('Failed to load data:', e)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [stage])

  // Group matches by group for group stage
  const groupMatches = stage === 'group'
    ? matches.reduce((acc, match) => {
        const g = match.group || 'Other'
        if (!acc[g]) acc[g] = []
        acc[g].push(match)
        return acc
      }, {} as Record<string, Match[]>)
    : null

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  return (
    <div className="schedule-page">
      <div className="stage-tabs">
        {(Object.keys(STAGE_LABELS) as Stage[]).map(s => (
          <button
            key={s}
            className={stage === s ? 'active' : ''}
            onClick={() => setStage(s)}
          >
            {STAGE_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="matches-container">
        {stage === 'group' && groupMatches ? (
          Object.entries(groupMatches)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([group, groupMatches]) => (
              <div key={group} className="group-section">
                <h3>📅 {group} 组</h3>
                <div className="group-matches">
                  {groupMatches.map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      teamA={teams[match.team_a]}
                      teamB={teams[match.team_b]}
                    />
                  ))}
                </div>
              </div>
            ))
        ) : (
          <div className="knockout-matches">
            {matches.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                teamA={teams[match.team_a]}
                teamB={teams[match.team_b]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}