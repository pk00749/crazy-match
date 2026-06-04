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
  BEL: { primary: '#000000', secondary: '#FFD100' },
  URU: { primary: '#5BBFEB', secondary: '#FFFFFF' },
  CRO: { primary: '#FF0000', secondary: '#171796' },
  // ... 可以继续添加更多球队颜色
}

// 获取球队颜色
export function getTeamColor(teamCode: string): { primary: string; secondary: string } {
  return teamColors[teamCode] || { primary: '#1a2235', secondary: '#ffffff' }
}

// 获取球队 Emoji
export function getTeamEmoji(teamCode: string): string {
  return teamFlags[teamCode] || '🏳️'
}

// 生成预测分享图片
export async function generatePredictionShareImage(
  teamAName: string,
  teamACode: string,
  teamBName: string,
  teamBCode: string,
  prediction: string, // 预测结果
  nickname: string
): Promise<string> {
  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 400
  const ctx = canvas.getContext('2d')!

  const colorA = getTeamColor(teamACode)
  const colorB = getTeamColor(teamBCode)
  const emojiA = getTeamEmoji(teamACode)
  const emojiB = getTeamEmoji(teamBCode)

  // 背景渐变
  const gradient = ctx.createLinearGradient(0, 0, 600, 400)
  gradient.addColorStop(0, '#0a0f1c')
  gradient.addColorStop(1, '#1a2235')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 600, 400)

  // 顶部装饰条
  ctx.fillStyle = '#00d4aa'
  ctx.fillRect(0, 0, 600, 8)

  // 标题
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 28px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('⚽ Crazy Match', 300, 50)

  ctx.font = '16px Arial'
  ctx.fillStyle = '#94a3b8'
  ctx.fillText('2026 世界杯预测', 300, 75)

  // 球队区域
  ctx.fillStyle = colorA.primary
  ctx.fillRect(40, 100, 180, 180)
  ctx.fillStyle = colorA.secondary
  ctx.fillRect(40, 100, 180, 60)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 20px Arial'
  ctx.fillText(teamAName, 130, 200)
  ctx.font = '60px Arial'
  ctx.fillText(emojiA, 130, 270)

  // VS
  ctx.fillStyle = '#00d4aa'
  ctx.font = 'bold 36px Arial'
  ctx.fillText('VS', 300, 190)

  // 预测结果
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 24px Arial'
  const predictionText = prediction === 'draw' ? '平局' : prediction === teamACode ? teamAName : teamBName
  ctx.fillText(`预测: ${predictionText}`, 300, 240)

  ctx.fillStyle = colorB.primary
  ctx.fillRect(380, 100, 180, 180)
  ctx.fillStyle = colorB.secondary
  ctx.fillRect(380, 100, 180, 60)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 20px Arial'
  ctx.fillText(teamBName, 470, 200)
  ctx.font = '60px Arial'
  ctx.fillText(emojiB, 470, 270)

  // 用户信息
  ctx.fillStyle = '#64748b'
  ctx.font = '14px Arial'
  ctx.fillText(`来自用户: ${nickname}`, 300, 320)

  // 底部水印
  ctx.fillStyle = '#334155'
  ctx.font = '12px Arial'
  ctx.fillText('Crazy Match - 世界杯预测平台', 300, 380)

  // 边框
  ctx.strokeStyle = '#00d4aa'
  ctx.lineWidth = 2
  ctx.strokeRect(10, 10, 580, 380)

  return canvas.toDataURL('image/png')
}

// 生成分享链接
export function generateShareLink(matchId: string, prediction?: string): string {
  const base = window.location.origin
  const params = new URLSearchParams()
  params.set('match', matchId)
  if (prediction) {
    params.set('pred', prediction)
  }
  return `${base}/share?${params.toString()}`
}

// 下载图片
export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}
