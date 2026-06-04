// 分享图片生成工具

const teamFlags: Record<string, string> = {
  ARG: '🇦🇷', MEX: '🇲🇽', CAN: '🇨🇦', GUA: '🇬🇹',
  ESP: '🇪🇸', BRA: '🇧🇷', ECU: '🇪🇨', PAR: '🇵🇾',
  FRA: '🇫🇷', EGY: '🇪🇬', NZL: '🇳🇿', VAN: '🇻🇺',
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', POR: '🇵🇹', MAR: '🇲🇦', MAS: '🇲🇾',
  GER: '🇩🇪', JPN: '🇯🇵', AUS: '🇦🇺', CHN: '🇨🇳',
  NED: '🇳🇱', CRO: '🇭🇷', KOR: '🇰🇷', JAM: '🇯🇲',
  BEL: '🇧🇪', ITA: '🇮🇹', USA: '🇺🇸', HAI: '🇭🇹',
  URU: '🇺🇾', COL: '🇨🇴', PAN: '🇵🇦', VEN: '🇻🇪',
  SEN: '🇸🇳', ALG: '🇩🇿', NGA: '🇳🇬', GAM: '🇬🇲',
  SUI: '🇨🇭', SWE: '🇸🇪', CMR: '🇨🇲', QAT: '🇶🇦',
  AUT: '🇦🇹', TUR: '🇹🇷', POL: '🇵🇱', BIH: '🇧🇦',
  UKR: '🇺🇦', SRB: '🇷🇸', ROU: '🇷🇴', LTU: '🇱🇹',
}

const teamColors: Record<string, { primary: string; secondary: string }> = {
  ARG: { primary: '#75AADB', secondary: '#FFFFFF' },
  BRA: { primary: '#009C3B', secondary: '#FFDF00' },
  FRA: { primary: '#002395', secondary: '#ED2939' },
  GER: { primary: '#000000', secondary: '#DD0000' },
  ENG: { primary: '#FFFFFF', secondary: '#CF142B' },
  ESP: { primary: '#C60B1E', secondary: '#F1BF00' },
  ITA: { primary: '#0066CC', secondary: '#008C45' },
  POR: { primary: '#006600', secondary: '#FF0000' },
  NED: { primary: '#FF6600', secondary: '#FFFFFF' },
}

export function getTeamColor(teamCode: string): { primary: string; secondary: string } {
  return teamColors[teamCode] || { primary: '#1a2235', secondary: '#ffffff' }
}

export function getTeamEmoji(teamCode: string): string {
  return teamFlags[teamCode] || '🏳️'
}

// 判断预测的胜出者
function getWinner(prediction: string, teamACode: string, teamBCode: string): 'A' | 'B' | 'draw' {
  if (prediction === 'draw') return 'draw'
  if (prediction === teamACode) return 'A'
  if (prediction === teamBCode) return 'B'
  return 'draw'
}

export async function generatePredictionShareImage(
  teamAName: string,
  teamACode: string,
  teamBName: string,
  teamBCode: string,
  prediction: string,
  nickname: string
): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 700
  const ctx = canvas.getContext('2d')!

  // 背景
  const gradient = ctx.createLinearGradient(0, 0, 600, 700)
  gradient.addColorStop(0, '#0a0f1c')
  gradient.addColorStop(1, '#1a2235')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 600, 700)

  // 顶部装饰
  ctx.fillStyle = '#00d4aa'
  ctx.fillRect(0, 0, 600, 6)

  // 标题
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 28px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('⚽ Crazy Match 预测', 300, 50)

  ctx.font = '16px Arial'
  ctx.fillStyle = '#94a3b8'
  ctx.fillText('2026 世界杯 · 智能预测', 300, 80)

  // 确定胜出者
  const winner = getWinner(prediction, teamACode, teamBCode)
  const colorA = getTeamColor(teamACode)
  const colorB = getTeamColor(teamBCode)
  const emojiA = getTeamEmoji(teamACode)
  const emojiB = getTeamEmoji(teamBCode)

  // 球队 A 区域
  const isWinnerA = winner === 'A'
  ctx.fillStyle = isWinnerA ? colorA.primary : '#334155'
  ctx.beginPath()
  ctx.roundRect(40, 110, 240, 280, 20)
  ctx.fill()
  
  if (isWinnerA) {
    // 获胜者边框发光
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.roundRect(40, 110, 240, 280, 20)
    ctx.stroke()
    
    // 冠军图标
    ctx.fillStyle = '#FFD700'
    ctx.font = 'bold 40px Arial'
    ctx.fillText('🥇', 160, 145)
  }

  // 球队 A 内容
  ctx.fillStyle = isWinnerA ? colorA.secondary : '#94a3b8'
  ctx.font = '50px Arial'
  ctx.fillText(emojiA, 160, 220)
  ctx.font = 'bold 22px Arial'
  ctx.fillText(teamAName, 160, 270)
  
  if (isWinnerA) {
    ctx.fillStyle = '#FFD700'
    ctx.font = 'bold 18px Arial'
    ctx.fillText('✅ 预测胜出', 160, 310)
  }

  // VS 区域
  ctx.fillStyle = '#00d4aa'
  ctx.font = 'bold 40px Arial'
  ctx.fillText('⚽', 300, 200)

  // 预测结果标签
  ctx.fillStyle = '#0a0f1c'
  ctx.beginPath()
  ctx.roundRect(220, 220, 160, 50, 25)
  ctx.fill()
  ctx.fillStyle = '#00d4aa'
  ctx.font = 'bold 18px Arial'
  ctx.fillText(prediction === 'draw' ? '🏟️ 平局' : '🎯 预测', 300, 250)

  // 球队 B 区域
  const isWinnerB = winner === 'B'
  ctx.fillStyle = isWinnerB ? colorB.primary : '#334155'
  ctx.beginPath()
  ctx.roundRect(320, 110, 240, 280, 20)
  ctx.fill()
  
  if (isWinnerB) {
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.roundRect(320, 110, 240, 280, 20)
    ctx.stroke()
    
    ctx.fillStyle = '#FFD700'
    ctx.font = 'bold 40px Arial'
    ctx.fillText('🥇', 440, 145)
  }

  ctx.fillStyle = isWinnerB ? colorB.secondary : '#94a3b8'
  ctx.font = '50px Arial'
  ctx.fillText(emojiB, 440, 220)
  ctx.font = 'bold 22px Arial'
  ctx.fillText(teamBName, 440, 270)
  
  if (isWinnerB) {
    ctx.fillStyle = '#FFD700'
    ctx.font = 'bold 18px Arial'
    ctx.fillText('✅ 预测胜出', 440, 310)
  }

  // 比分预测条
  ctx.fillStyle = '#1a2235'
  ctx.beginPath()
  ctx.roundRect(40, 410, 520, 80, 15)
  ctx.fill()

  // 预测结果文字
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 36px Arial'
  ctx.textAlign = 'center'
  
  let resultText = ''
  if (prediction === 'draw') {
    resultText = '🏟️ 预测: 平局'
  } else if (prediction === teamACode) {
    resultText = `🎯 ${teamAName} 胜出！`
  } else if (prediction === teamBCode) {
    resultText = `🎯 ${teamBName} 胜出！`
  } else {
    resultText = '🏆 等待比赛结果'
  }
  ctx.fillText(resultText, 300, 455)

  // 用户信息
  ctx.fillStyle = '#64748b'
  ctx.font = '16px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`来自预测者: ${nickname}`, 300, 510)
  ctx.fillText(new Date().toLocaleDateString('zh-CN'), 300, 535)

  // 分隔线
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(100, 560)
  ctx.lineTo(500, 560)
  ctx.stroke()

  // 底部水印
  ctx.fillStyle = '#00d4aa'
  ctx.font = 'bold 18px Arial'
  ctx.fillText('Crazy Match · 世界杯预测平台', 300, 600)

  ctx.fillStyle = '#64748b'
  ctx.font = '12px Arial'
  ctx.fillText('扫码参与预测，赢取丰厚奖励', 300, 630)

  // 边框
  ctx.strokeStyle = '#00d4aa'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect(10, 10, 580, 680, 20)
  ctx.stroke()

  return canvas.toDataURL('image/png')
}

export function generateShareLink(matchId: string, prediction?: string): string {
  const base = window.location.origin
  const params = new URLSearchParams()
  params.set('match', matchId)
  if (prediction) params.set('pred', prediction)
  return `${base}/share?${params.toString()}`
}

export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}
