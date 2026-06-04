import { useState, useEffect } from 'react'
import { generatePredictionShareImage } from '../utils/shareImage'
import { teamsApi } from '../api'
import { matchesApi } from '../api'

interface ShareImageModalProps {
  matchId: string
  onClose: () => void
}

export default function ShareImageModal({ matchId, onClose }: ShareImageModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateImage()
  }, [matchId])

  const generateImage = async () => {
    setLoading(true)
    try {
      const match = matchesApi.getById(matchId)
      if (!match) throw new Error('Match not found')

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

      const url = await generatePredictionShareImage(
        teamA?.name || match.team_a,
        match.team_a,
        teamB?.name || match.team_b,
        match.team_b,
        userPrediction,
        nickname
      )

      setImageUrl(url)
    } catch (err) {
      console.error('Failed to generate image:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    if (!imageUrl) return
    
    const link = document.createElement('a')
    link.download = `crazy-match-${matchId}.png`
    link.href = imageUrl
    link.click()
  }

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={e => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3>📤 分享预测图片</h3>
          <button className="share-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="share-modal-content">
          {loading ? (
            <div className="share-loading">
              <div className="loading-ball">⚽</div>
              <span>生成中...</span>
            </div>
          ) : imageUrl ? (
            <div className="share-image-container">
              <img src={imageUrl} alt="预测分享图" className="share-image" />
            </div>
          ) : (
            <div className="share-error">生成失败</div>
          )}
        </div>

        <div className="share-modal-footer">
          <button className="share-btn-cancel" onClick={onClose}>关闭</button>
          <button className="share-btn-save" onClick={handleSave} disabled={!imageUrl}>
            💾 保存图片
          </button>
          <button 
            className="share-btn-copy" 
            onClick={() => {
              if (imageUrl) {
                navigator.clipboard.writeText(`我在 Crazy Match 预测了世界杯比赛，快来看看！`)
                alert('已复制分享文案！')
              }
            }}
          >
            📋 复制文案
          </button>
        </div>
      </div>
    </div>
  )
}
