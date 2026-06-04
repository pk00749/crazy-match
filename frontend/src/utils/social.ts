// 生成分享链接
export function generateShareLink(matchId: string, winner: string): string {
  const base = window.location.origin
  return `${base}/share/${matchId}?winner=${winner}`
}

// 复制到剪贴板
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

// 生成分享图片（Canvas）
export async function generateShareImage(
  canvas: HTMLCanvasElement,
  matchInfo: { teamA: string; teamB: string; winner: string; nickname: string }
): Promise<string> {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  canvas.width = 600
  canvas.height = 600

  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, 600, 600)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 32px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Crazy Match 预测', 300, 80)

  ctx.font = '28px sans-serif'
  ctx.fillText(`${matchInfo.teamA} vs ${matchInfo.teamB}`, 300, 200)

  ctx.fillStyle = '#e94560'
  ctx.font = 'bold 48px sans-serif'
  ctx.fillText(`${matchInfo.winner} 预测成功`, 300, 300)

  ctx.fillStyle = '#a0a0a0'
  ctx.font = '24px sans-serif'
  ctx.fillText(`by ${matchInfo.nickname}`, 300, 380)

  ctx.font = '20px sans-serif'
  ctx.fillText(new Date().toLocaleDateString('zh-CN'), 300, 450)

  ctx.fillStyle = '#666666'
  ctx.font = '18px sans-serif'
  ctx.fillText('扫码来 Crazy Match 预测', 300, 550)

  return canvas.toDataURL('image/png')
}