import { useState, useEffect } from 'react'
import MatchCard from '../components/MatchCard'
import PredictionForm from '../components/PredictionForm'
import { matchesApi, teamsApi, predictApi } from '../api'

type Stage = 'group' | 'round16' | 'quarter' | 'semi' | 'final'

const stageTabs: { key: Stage; label: string }[] = [
  { key: 'group', label: '小组赛' },
  { key: 'round16', label: '16强' },
  { key: 'quarter', label: '8强' },
  { key: 'semi', label: '4强' },
  { key: 'final', label: '决赛' },
]

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<Stage>('group')
  const [matches, setMatches] = useState<any[]>([])
  const [predictions, setPredictions] = useState<Record<string, any>>({})
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPredictionForm, setShowPredictionForm] = useState<string | null>(null)

  useEffect(() => { loadAllMatches() }, [])

  const loadAllMatches = async () => {
    setLoading(true)
    try {
      const data = matchesApi.getAll()
      setMatches(data || [])

      const preds: Record<string, any> = {}
      for (const match of data || []) {
        try {
          preds[match.id] = predictApi.getByMatch(match.id)
        } catch (e) { /* silent */ }
      }
      setPredictions(preds)
    } catch (err) {
      console.error('Failed to load matches:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab: Stage) => {
    setActiveTab(tab)
    setSelectedMatchId(null)
    
    const tabMatches = matches.filter(m => m.stage === tab)
    if (tabMatches.length > 0) {
      setTimeout(() => setSelectedMatchId(tabMatches[0].id), 50)
    }
  }

  const filteredMatches = matches.filter(m => m.stage === activeTab)

  const groupedMatches = activeTab === 'group'
    ? Array.from(new Set(filteredMatches.map(m => m.group)))
        .sort()
        .map(group => ({
          group,
          matches: filteredMatches.filter(m => m.group === group)
        }))
    : null

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">📅 完整赛程</h2>
        <span className="page-meta">{matches.length} 场比赛</span>
      </div>

      <div className="tabs">
        {stageTabs.map(tab => {
          const count = matches.filter(m => m.stage === tab.key).length
          return (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.label}
              {count > 0 && <span className="tab-count">{count}</span>}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-ball">⚽</div>
          加载中...
        </div>
      ) : activeTab === 'group' && groupedMatches ? (
        <div>
          {groupedMatches.map(({ group, matches }) => (
            <div key={group}>
              <div className="group-header">
                <h3>小组 {group}</h3>
              </div>
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
                      stage: match.stage,
                      group: match.group,
                    }}
                    isSelected={selectedMatchId === match.id}
                    prediction={predictions[match.id]}
                    onSelect={setSelectedMatchId}
                    onPredict={(id) => setShowPredictionForm(id)}
                  />
                )
              })}
            </div>
          ))}
        </div>
      ) : (
        <div>
          {filteredMatches.map(match => {
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
                  stage: match.stage,
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
            onSuccess={loadAllMatches}
          />
        )
      })()}
    </div>
  )
}
