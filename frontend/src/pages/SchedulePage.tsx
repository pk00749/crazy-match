import { useState, useEffect } from 'react'
import MatchCard from '../components/MatchCard'
import { matchesApi, teamsApi, predictApi } from '../api'
import PredictionForm from '../components/PredictionForm'
import { generatePredictionShareImage, downloadImage } from '../utils/shareImage'

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

  useEffect(() => {
    loadAllMatches()
  }, [])

  const loadAllMatches = async () => {
    setLoading(true)
    try {
      const data = matchesApi.getAll()
      setMatches(data || [])

      const preds: Record<string, any> = {}
      for (const match of data || []) {
        try {
          preds[match.id] = predictApi.getByMatch(match.id)
        } catch (e) {}
      }
      setPredictions(preds)
      
      if (data && data.length > 0 && activeTab === 'group') {
        const groupMatches = data.filter(m => m.stage === 'group')
        if (groupMatches.length > 0) {
          setSelectedMatchId(groupMatches[0].id)
        }
      }
    } catch (err) {
      console.error('Failed to load matches:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async (matchId: string) => {
    const match = matches.find(m => m.id === matchId)
    if (!match) return

    const teamA = teamsApi.getById(match.team_a)
    const teamB = teamsApi.getById(match.team_b)
    
    const userPred = localStorage.getItem('crazy_match_predictions')
    let userPrediction = ''
    let nickname = '球迷'
    
    if (userPred) {
      const predictions = JSON.parse(userPred)
      const myPred = predictions[matchId]
      if (myPred) {
        userPrediction = myPred.prediction
        nickname = myPred.nickname
      }
    }

    try {
      const imageData = await generatePredictionShareImage(
        teamA?.name || match.team_a,
        match.team_a,
        teamB?.name || match.team_b,
        match.team_b,
        userPrediction,
        nickname
      )
      downloadImage(imageData, `crazy-match-${matchId}.png`)
    } catch (err) {
      const link = `${window.location.origin}/share/${matchId}`
      navigator.clipboard.writeText(link)
      alert('分享链接已复制到剪贴板！')
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

  // 计算小组赛进度
  const groupMatches = matches.filter(m => m.stage === 'group')
  const progressText = `小组赛 ${filteredMatches.length} 场`

  return (
    <div className="schedule-page">
      {/* 顶部进度条 */}
      <div className="countdown-bar">
        <span className="countdown-title">📅 完整赛程</span>
        <span className="countdown-days">{progressText}</span>
      </div>

      <div className="stage-tabs">
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
        <div className="groups-container">
          {groupedMatches.map(({ group, matches }) => (
            <div key={group} className="group-section">
              <h3>🏆 小组 {group}</h3>
              <div className="group-matches">
                {matches.map(match => {
                  const teamA = teamsApi.getById(match.team_a)
                  const teamB = teamsApi.getById(match.team_b)
                  return (
                    <MatchCard
                      key={match.id}
                      match={{
                        id: match.id,
                        team_a_code: match.team_a,
                        team_a: teamA?.name || match.team_a,
                        team_b_code: match.team_b,
                        team_b: teamB?.name || match.team_b,
                        time: match.time,
                        venue: match.venue,
                        stage: match.stage,
                        group: match.group,
                      }}
                      isSelected={selectedMatchId === match.id}
                      prediction={predictions[match.id]}
                      onSelect={setSelectedMatchId}
                      onPredict={(id) => setShowPredictionForm(id)}
                      onShare={handleShare}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="knockout-matches">
          {filteredMatches.map(match => {
            const teamA = teamsApi.getById(match.team_a)
            const teamB = teamsApi.getById(match.team_b)
            return (
              <MatchCard
                key={match.id}
                match={{
                  id: match.id,
                  team_a_code: match.team_a,
                  team_a: teamA?.name || match.team_a,
                  team_b_code: match.team_b,
                  team_b: teamB?.name || match.team_b,
                  time: match.time,
                  venue: match.venue,
                  stage: match.stage,
                }}
                isSelected={selectedMatchId === match.id}
                prediction={predictions[match.id]}
                onSelect={setSelectedMatchId}
                onPredict={(id) => setShowPredictionForm(id)}
                onShare={handleShare}
              />
            )
          })}
        </div>
      )}

      {showPredictionForm && (() => {
        const match = matches.find(m => m.id === showPredictionForm)
        const teamA = teamsApi.getById(match?.team_a)
        const teamB = teamsApi.getById(match?.team_b)
        return (
          <PredictionForm
            matchId={showPredictionForm}
            teamACode={match?.team_a || ''}
            teamAName={teamA?.name || match?.team_a || ''}
            teamBCode={match?.team_b || ''}
            teamBName={teamB?.name || match?.team_b || ''}
            onClose={() => setShowPredictionForm(null)}
          />
        )
      })()}
    </div>
  )
}
