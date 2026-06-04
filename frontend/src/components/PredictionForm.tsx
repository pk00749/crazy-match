import { useState } from 'react'
import { supabase } from '../lib/supabase'

interface PredictionFormProps {
  matchId: string
  teamACode: string
  teamAName: string
  teamBCode: string
  teamBName: string
  onClose: () => void
  onSuccess?: () => void
}

export default function PredictionForm({ matchId, teamACode, teamAName, teamBCode, teamBName, onClose, onSuccess }: PredictionFormProps) {
  const [nickname, setNickname] = useState('')
  const [prediction, setPrediction] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nickname || !prediction) {
      setMessage('请填写昵称和预测')
      return
    }

    setSubmitting(true)
    setMessage('')
    
    try {
      // 获取设备ID
      let deviceId = localStorage.getItem('crazy_match_device_id')
      if (!deviceId) {
        deviceId = 'device_' + Math.random().toString(36).substring(2, 15)
        localStorage.setItem('crazy_match_device_id', deviceId)
      }

      // 提交到 Supabase
      const { data, error } = await supabase
        .from('predictions')
        .upsert({
          match_id: matchId,
          device_id: deviceId,
          nickname: nickname,
          predicted_winner: prediction,
          team_a_code: teamACode,
          team_b_code: teamBCode,
        }, { onConflict: 'match_id,device_id' })
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      // 同时保存到 localStorage 作为备份
      const localPredictions = JSON.parse(localStorage.getItem('crazy_match_predictions') || '{}')
      localPredictions[matchId] = { nickname, prediction, timestamp: Date.now() }
      localStorage.setItem('crazy_match_predictions', JSON.stringify(localPredictions))

      setMessage('✅ 预测提交成功！')
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 1500)
    } catch (err: any) {
      console.error('Failed to submit:', err)
      // 如果 Supabase 失败，保存到本地
      const localPredictions = JSON.parse(localStorage.getItem('crazy_match_predictions') || '{}')
      localPredictions[matchId] = { nickname, prediction, timestamp: Date.now() }
      localStorage.setItem('crazy_match_predictions', JSON.stringify(localPredictions))
      
      setMessage('✅ 已保存到本地（离线模式）')
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 1500)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="prediction-form-overlay" onClick={onClose}>
      <div className="prediction-form" onClick={e => e.stopPropagation()}>
        <h3>🏆 提交预测</h3>
        <div className="match-info">{teamAName} vs {teamBName}</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>昵称</label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="输入你的昵称"
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <label>预测结果</label>
            <div className="prediction-options">
              <button
                type="button"
                className={prediction === teamACode ? 'selected' : ''}
                onClick={() => setPrediction(teamACode)}
              >
                {teamAName} 胜
              </button>
              <button
                type="button"
                className={prediction === 'draw' ? 'selected' : ''}
                onClick={() => setPrediction('draw')}
              >
                平局
              </button>
              <button
                type="button"
                className={prediction === teamBCode ? 'selected' : ''}
                onClick={() => setPrediction(teamBCode)}
              >
                {teamBName} 胜
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>取消</button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? '提交中...' : '确认预测'}
            </button>
          </div>
        </form>

        {message && (
          <div className={`message ${message.includes('成功') || message.includes('本地') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
