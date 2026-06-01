const API_BASE = '/api'

export interface Team {
  id: string
  name: string
  code: string
  flag: string
  fifa_rank: number
  group: string
  historic_record?: HistoricRecord
  current_squad?: Player[]
  strength_score?: StrengthScore
}

export interface HistoricRecord {
  participations: number
  championships: number
  wins: number
  draws: number
  losses: number
  goals_scored: number
  goals_conceded: number
  best_result: string
  recent_performance: string[]
}

export interface Player {
  id: string
  name: string
  position: 'GK' | 'DEF' | 'MID' | 'FWD'
  age: number
  club: string
  market_value: number
  rating: number
}

export interface StrengthScore {
  historic: number
  player: number
  total: number
}

export interface Match {
  id: string
  date: string
  time: string
  stage: 'group' | 'round16' | 'quarter' | 'semi' | 'final'
  group?: string
  team_a: string
  team_b: string
  venue: string
  city: string
}

export interface Prediction {
  model: string
  win_probability: Record<string, number>
  strength_rating: Record<string, number>
  factors: string[]
  match?: Match
}

export async function getTeams(): Promise<Team[]> {
  const res = await fetch(`${API_BASE}/teams/`)
  if (!res.ok) throw new Error('Failed to fetch teams')
  return res.json()
}

export async function getTeam(teamId: string): Promise<Team> {
  const res = await fetch(`${API_BASE}/teams/${teamId}`)
  if (!res.ok) throw new Error('Failed to fetch team')
  return res.json()
}

export async function getMatches(filters?: { date?: string; stage?: string; group?: string }): Promise<Match[]> {
  const params = new URLSearchParams()
  if (filters?.date) params.set('date', filters.date)
  if (filters?.stage) params.set('stage', filters.stage)
  if (filters?.group) params.set('group', filters.group)

  const url = `${API_BASE}/matches/${params.toString() ? '?' + params.toString() : ''}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch matches')
  return res.json()
}

export async function getPrediction(matchId: string): Promise<Prediction> {
  const res = await fetch(`${API_BASE}/predict/${matchId}`)
  if (!res.ok) throw new Error('Failed to fetch prediction')
  return res.json()
}

export async function postPredict(teamA: string, teamB: string, model: string = 'squad'): Promise<Prediction> {
  const res = await fetch(`${API_BASE}/predict/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ team_a: teamA, team_b: teamB, model })
  })
  if (!res.ok) throw new Error('Failed to predict')
  return res.json()
}