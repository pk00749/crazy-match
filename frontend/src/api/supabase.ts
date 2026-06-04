import { supabase } from '../lib/supabase'

// 设备ID生成（简化版）
export function getDeviceId(): string {
  let deviceId = localStorage.getItem('crazy_match_device_id')
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substring(2, 15)
    localStorage.setItem('crazy_match_device_id', deviceId)
  }
  return deviceId
}

// 提交预测到 Supabase
// winner: 具体的国家队代码如 'ARG', 'BRA', 或 'draw'
export async function submitPrediction(
  matchId: string,
  nickname: string,
  teamACode: string,
  teamBCode: string,
  winner: string  // 球队代码或 'draw'
) {
  const deviceId = getDeviceId()
  
  const { data, error } = await supabase
    .from('predictions')
    .upsert({
      match_id: matchId,
      device_id: deviceId,
      nickname: nickname,
      predicted_winner: winner,  // 存储具体球队代码或 'draw'
      team_a_code: teamACode,
      team_b_code: teamBCode,
    }, { onConflict: 'match_id,device_id' })
    .select()
  
  if (error) throw error
  return data
}

// 获取用户预测记录
export async function getUserPredictions() {
  const deviceId = getDeviceId()
  
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

// 获取所有预测记录（用于排行榜统计）
export async function getAllPredictions() {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

// 获取排行榜
export async function getLeaderboard(limit = 20) {
  const { data, error } = await supabase
    .from('leaderboard_stats')
    .select('*')
    .order('correct_count', { ascending: false })
    .order('current_streak', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data || []
}

// 更新排行榜
export async function updateLeaderboard(nickname: string, isCorrect: boolean) {
  const deviceId = getDeviceId()
  
  const { data, error } = await supabase.rpc('update_leaderboard', {
    p_device_id: deviceId,
    p_nickname: nickname,
    p_is_correct: isCorrect,
  })
  
  if (error) console.error('Failed to update leaderboard:', error)
  return data
}

// 获取比赛结果
export async function getMatchResult(matchId: string) {
  const { data, error } = await supabase
    .from('match_results')
    .select('*')
    .eq('match_id', matchId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}
