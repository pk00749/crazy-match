import { useState, useEffect } from 'react'
import MatchCard from '../components/MatchCard'
import { matchesApi, predictApi } from '../api'

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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAllMatches()
  }, [])

  const loadAllMatches = async () => {
    setLoading(true)
    try {
      const data = await matchesApi.getAll()
      setMatches(data || [])

      for (const match of data || []) {
        try {
          const pred = await predictApi.getByMatch(match.id)
          setPredictions(prev => ({ ...prev, [match.id]: pred }))
        } catch {}
      }
    } catch (err) {
      console.error('Failed to load matches:', err)
    } finally {
      setLoading(false)
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
    <div className="schedule-page">
      <div className="stage-tabs">
        {stageTabs.map(tab => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : activeTab === 'group' && groupedMatches ? (
        <div className="groups-container">
          {groupedMatches.map(({ group, matches }) => (
            <div key={group} className="group-section">
              <h3>小组 {group}</h3>
              <div className="group-matches">
                {matches.map(match => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    prediction={predictions[match.id]}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="knockout-matches">
          {filteredMatches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              prediction={predictions[match.id]}
            />
          ))}
        </div>
      )}
    </div>
  )
}