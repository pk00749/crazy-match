import { useState, useEffect } from 'react'
import DatePicker from '../components/DatePicker'
import MatchCard from '../components/MatchCard'
import PredictionForm from '../components/PredictionForm'
import { matchesApi, teamsApi, predictApi } from '../api'
import { generatePredictionShareImage, downloadImage } from '../utils/shareImage'

export default function TodayPage() {
  const [selectedDate, setSelectedDate] = useState(new Date('2026-06-11'))
  const [matches, setMatches] = useState<any[]>([])
  const [predictions, setPredictions] = useState<Record<string, any>>({})
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPredictionForm, setShowPredictionForm] = useState<string | null>(null)

  useEffect(() => {
    loadMatches()
  }, [selectedDate])

  const loadMatches = async () => {
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
        } catch (e) {}
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
  }

  const handleShare = async (matchId: string) => {
    const match = matches.find(m => m.id === matchId)
    if (!match) return

    const teamA = teamsApi.getById(match.team_a)
    const teamB = teamsApi.getById(match.team_b)
    
    // 获取用户预测
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
      // Fallback to link sharing
      const link = `${window.location.origin}/share/${matchId}`
      navigator.clipboard.writeText(link)
      alert('分享链接已复制到剪贴板！')
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  // 计算世界杯倒计时
  const worldCupDate = new Date('2026-06-11')
  const today = new Date()
  const daysLeft = Math.ceil((worldCupDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="today-page">
      {/* 顶部倒计时 */}
      <div className="countdown-bar">
        <span className="countdown-title">🏆 2026 世界杯</span>
        <span className="countdown-days">{daysLeft > 0 ? `倒计时 ${daysLeft} 天` : '进行中'}</span>
      </div>

      <div className="today-header">
        <div>
          <h2>{formatDate(selectedDate)}</h2>
          <span className="today-date-badge">📅 共 {matches.length} 场比赛</span>
        </div>
        <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-ball">⚽</div>
          加载中...
        </div>
      ) : matches.length === 0 ? (
        <div className="no-matches">
          <div className="no-matches-icon">🏆</div>
          <p>当天没有比赛</p>
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
