import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getDeviceId } from '../utils/device'

export interface UserPrediction {
  id: string
  match_id: string
  device_id: string
  nickname: string
  predicted_winner: 'teamA' | 'teamB' | 'draw'
  created_at: string
  is_correct?: boolean
}

export function usePredictions() {
  const [deviceId, setDeviceId] = useState<string>('')
  const [predictions, setPredictions] = useState<UserPrediction[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getDeviceId().then(setDeviceId)
  }, [])

  const submitPrediction = async (
    matchId: string,
    nickname: string,
    predictedWinner: 'teamA' | 'teamB' | 'draw'
  ) => {
    if (!deviceId) {
      const id = await getDeviceId()
      setDeviceId(id)
    }

    setLoading(true)
    const { error } = await supabase.from('predictions').insert({
      match_id: matchId,
      device_id: deviceId,
      nickname,
      predicted_winner: predictedWinner,
    })
    setLoading(false)

    if (error) throw error
    await refreshPredictions()
  }

  const refreshPredictions = async () => {
    if (!deviceId) return
    const { data } = await supabase
      .from('predictions')
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false })
    if (data) setPredictions(data)
  }

  const getStats = () => {
    const total = predictions.length
    const correct = predictions.filter(p => p.is_correct === true).length
    return { total, correct, accuracy: total > 0 ? Math.round(correct / total * 100) : 0 }
  }

  return { predictions, loading, submitPrediction, refreshPredictions, getStats }
}