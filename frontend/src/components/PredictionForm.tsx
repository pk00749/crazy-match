import { useState } from 'react'
import { submitPrediction } from '../api/supabase'

interface PredictionFormProps {
  matchId: string
  teamACode: string  // 新增
  teamAName: string
  teamBCode: string  // 新增
  teamBName: string
  onClose: () => void
}

export default function PredictionForm({ matchId, teamACode, teamAName, teamBCode, teamBName, onClose }: PredictionFormProps) {
  const [nickname, setNickname] = useState('')
  const [prediction, setPrediction] = useState<string>('')  // 改为 string 类型
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
      await submitPrediction(matchId, nickname, teamACode, teamBCode, prediction)
      setMessage('预测提交成功！')
      setTimeout(onClose, 1500)
    } catch (err) {
      console.error('Failed to submit prediction:', err)
      setMessage('提交失败，请重试')
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
          <div className={`message ${message.includes('成功') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
