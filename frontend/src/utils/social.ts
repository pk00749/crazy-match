/**
 * 社交功能 - 基于 localStorage 实现
 */

export interface UserPrediction {
  id: string
  matchId: string
  nickname: string
  predictedWinner: 'teamA' | 'teamB' | 'draw'
  predictedScore?: { teamA: number; teamB: number }
  createdAt: string
}

export interface UserStats {
  nickname: string
  totalPredictions: number
  correctPredictions: number
  currentStreak: number
  longestStreak: number
  lastUpdated: string
}

const PREDICTIONS_KEY = 'crazy_match_predictions'
const STATS_KEY = 'crazy_match_stats'

// 生成唯一ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 保存预测
export function savePrediction(prediction: UserPrediction): void {
  const predictions = getPredictions()
  predictions.push(prediction)
  localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(predictions))
  updateStats(prediction.nickname)
}

// 获取所有预测
export function getPredictions(): UserPrediction[] {
  const data = localStorage.getItem(PREDICTIONS_KEY)
  return data ? JSON.parse(data) : []
}

// 获取用户的预测
export function getUserPredictions(nickname: string): UserPrediction[] {
  return getPredictions().filter(p => p.nickname === nickname)
}

// 获取特定比赛的预测
export function getMatchPredictions(matchId: string): UserPrediction[] {
  return getPredictions().filter(p => p.matchId === matchId)
}

// 检查用户是否已预测某场比赛
export function hasUserPredicted(nickname: string, matchId: string): boolean {
  return getUserPredictions(nickname).some(p => p.matchId === matchId)
}

// 更新用户统计
function updateStats(nickname: string): void {
  const predictions = getUserPredictions(nickname)
  const stats = getUserStats()

  const userStat = stats.find(s => s.nickname === nickname) || {
    nickname,
    totalPredictions: 0,
    correctPredictions: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastUpdated: new Date().toISOString()
  }

  userStat.totalPredictions = predictions.length
  userStat.lastUpdated = new Date().toISOString()

  // 移除旧记录，添加更新后的
  const otherStats = stats.filter(s => s.nickname !== nickname)
  otherStats.push(userStat)

  localStorage.setItem(STATS_KEY, JSON.stringify(otherStats))
}

// 获取所有用户统计
export function getUserStats(): UserStats[] {
  const data = localStorage.getItem(STATS_KEY)
  return data ? JSON.parse(data) : []
}

// 获取排行榜
export function getLeaderboard(type: 'total' | 'streak' = 'total'): UserStats[] {
  const stats = getUserStats()

  if (type === 'streak') {
    return stats
      .filter(s => s.totalPredictions >= 3) // 至少3次预测
      .sort((a, b) => b.currentStreak - a.currentStreak || b.correctPredictions - a.correctPredictions)
      .slice(0, 20)
  }

  return stats
    .filter(s => s.totalPredictions >= 3)
    .sort((a, b) => {
      const aRate = a.totalPredictions > 0 ? a.correctPredictions / a.totalPredictions : 0
      const bRate = b.totalPredictions > 0 ? b.correctPredictions / b.totalPredictions : 0
      return bRate - aRate || b.correctPredictions - a.correctPredictions
    })
    .slice(0, 20)
}

// 生成分享链接
export function generateShareUrl(matchId: string, winner: 'teamA' | 'teamB' | 'draw'): string {
  const base = window.location.origin
  return `${base}/p/${matchId}?winner=${winner}`
}

// 解析分享链接参数
export function parseShareParams(): { matchId: string; winner: string } | null {
  const path = window.location.pathname
  const matchMatch = path.match(/\/p\/([^/]+)/)

  if (!matchMatch) return null

  const matchId = matchMatch[1]
  const params = new URLSearchParams(window.location.search)
  const winner = params.get('winner')

  if (!winner) return null

  return { matchId, winner }
}

// 计算连胜
export function calculateStreak(predictions: UserPrediction[], results: Record<string, string>): number {
  let streak = 0
  for (let i = predictions.length - 1; i >= 0; i--) {
    const p = predictions[i]
    const result = results[p.matchId]
    if (!result) break

    const predictedCorrect = (
      (result === 'teamA' && p.predictedWinner === 'teamA') ||
      (result === 'teamB' && p.predictedWinner === 'teamB') ||
      (result === 'draw' && p.predictedWinner === 'draw')
    )

    if (predictedCorrect) {
      streak++
    } else {
      break
    }
  }
  return streak
}

// 晒单图片生成
export async function generateShareImage(
  canvas: HTMLCanvasElement,
  match: { teamA: string; teamB: string; date: string },
  prediction: { winner: string; nickname: string }
): Promise<string> {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  // 设置尺寸 1:1 正方形
  canvas.width = 800
  canvas.height = 800

  // 背景渐变
  const gradient = ctx.createLinearGradient(0, 0, 800, 800)
  gradient.addColorStop(0, '#1a1a2e')
  gradient.addColorStop(1, '#16213e')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 800, 800)

  // 标题
  ctx.fillStyle = '#ffd700'
  ctx.font = 'bold 48px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('🏆 Crazy Match 预测', 400, 80)

  // 比赛信息
  ctx.fillStyle = '#fff'
  ctx.font = '32px sans-serif'
  ctx.fillText(match.date, 400, 180)

  // VS 对战
  ctx.font = 'bold 64px sans-serif'
  ctx.fillText(`${match.teamA} VS ${match.teamB}`, 400, 300)

  // 预测结果
  ctx.fillStyle = '#ffd700'
  ctx.font = 'bold 48px sans-serif'
  const winnerText = prediction.winner === 'teamA' ? match.teamA :
                     prediction.winner === 'teamB' ? match.teamB : '平局'
  ctx.fillText(`预测: ${winnerText} 获胜`, 400, 420)

  // 昵称
  ctx.fillStyle = '#888'
  ctx.font = '36px sans-serif'
  ctx.fillText(`by @${prediction.nickname}`, 400, 520)

  // 底部提示
  ctx.fillStyle = '#666'
  ctx.font = '28px sans-serif'
  ctx.fillText('扫码来 Crazy Match 预测', 400, 700)

  // 时间戳
  ctx.fillStyle = '#444'
  ctx.font = '24px sans-serif'
  ctx.fillText(new Date().toLocaleString('zh-CN'), 400, 760)

  return canvas.toDataURL('image/png')
}