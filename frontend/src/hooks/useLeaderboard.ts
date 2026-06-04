import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface LeaderboardEntry {
  nickname: string
  correct_count: number
  total_count: number
  current_streak: number
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase.rpc('get_leaderboard')
      if (error) throw error
      setLeaderboard(data || [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  useEffect(() => {
    const interval = setInterval(fetchLeaderboard, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchLeaderboard])

  return { leaderboard, loading, error, refresh: fetchLeaderboard }
}