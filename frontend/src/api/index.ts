import teamsData from '../data/teams.json'
import matchesData from '../data/matches.json'

// 预测算法 v2.0
const HISTORIC_WEIGHTS = { worldCupTitles: 15, appearances: 5, winRate: 10, recentPerformance: 10 }
const SQUAD_WEIGHTS = { fifaRank: 15, bigLeaguePlayers: 15, marketValue: 15, coach: 5, squadDepth: 10 }

function calculateHistoricScore(team: any): number {
  const baseScore = Math.max(20, 100 - (team.fifa_rank || 50))
  const titlesBonus = getTitlesBonus(team.id)
  const winRateBonus = getWinRateBonus(team.id)
  const recentBonus = getRecentPerformanceBonus(team.id)
  return Math.min(100, Math.round(baseScore + titlesBonus + winRateBonus + recentBonus))
}

function getTitlesBonus(teamId: string): number {
  const titles: Record<string, number> = {
    BRA: 15, GER: 10, ITA: 10, ARG: 8, FRA: 6, URU: 4, ENG: 4, ESP: 2,
  }
  return titles[teamId] || 0
}

function getWinRateBonus(teamId: string): number {
  const winRates: Record<string, number> = {
    BRA: 10, ARG: 8, GER: 8, FRA: 7, ITA: 7, ENG: 6, ESP: 6, NED: 5, URU: 5,
    POR: 4, CRO: 4, BEL: 3, COL: 3, MEX: 3, USA: 2, JPN: 2, KOR: 2, AUS: 1,
    MAR: 2, SEN: 1, EGY: 1, CMR: 1, NGA: 1, POL: 1, SWE: 1,
  }
  return winRates[teamId] || 0
}

function getRecentPerformanceBonus(teamId: string): number {
  const recent: Record<string, number> = {
    ARG: 8, FRA: 7, CRO: 5, MAR: 6, ENG: 5, BRA: 5, NED: 4, POR: 3, ESP: 3,
    GER: 2, ITA: 2, BEL: 1,
  }
  return recent[teamId] || 0
}

function calculateSquadScore(team: any): number {
  const rankScore = Math.max(10, 100 - (team.fifa_rank || 50)) * 0.3
  const strengthScore = (team.strengthScore || 70) * 0.7
  return Math.min(100, Math.round(rankScore + strengthScore))
}

function calculateTotalScore(team: any): number {
  return Math.round(calculateHistoricScore(team) * 0.4 + calculateSquadScore(team) * 0.6)
}

function calculateWinProbability(teamA: any, teamB: any) {
  const scoreA = calculateTotalScore(teamA)
  const scoreB = calculateTotalScore(teamB)
  const diff = scoreA - scoreB
  
  const baseWinRate = 1 / (1 + Math.pow(10, -diff / 15))
  const homeBonus = getHomeBonus(teamA.id, teamB.id)
  const adjustedWinRate = Math.min(0.95, Math.max(0.05, baseWinRate + homeBonus))
  
  const drawChance = Math.max(5, Math.min(30, Math.round(20 - Math.abs(diff) / 10)))
  
  // 直接计算整数百分比，确保总和为100
  const teamAWinFloat = adjustedWinRate * (100 - drawChance)
  const teamBWinFloat = 100 - drawChance - teamAWinFloat
  
  const teamAWin = Math.round(teamAWinFloat)
  const teamBWin = 100 - drawChance - teamAWin
  
  return {
    win_probability: { team_a: teamAWin, team_b: teamBWin, draw: drawChance },
    strength_rating: { team_a: scoreA, team_b: scoreB },
    historic_score: { 
      team_a: calculateHistoricScore(teamA), 
      team_b: calculateHistoricScore(teamB) 
    },
    squad_score: { 
      team_a: calculateSquadScore(teamA), 
      team_b: calculateSquadScore(teamB) 
    },
  }
}

function getHomeBonus(teamAId: string, teamBId: string): number {
  const hostTeams = ['USA', 'CAN', 'MEX']
  const isTeamAHost = hostTeams.includes(teamAId)
  const isTeamBHost = hostTeams.includes(teamBId)
  if (isTeamAHost && !isTeamBHost) return 0.03
  if (isTeamBHost && !isTeamAHost) return -0.03
  return 0
}

let predictions: Record<string, any> = {}

export const matchesApi = {
  getAll: () => matchesData.matches,
  getByDate: (date: string) => matchesData.matches.filter((m: any) => m.date === date),
  getById: (id: string) => matchesData.matches.find((m: any) => m.id === id),
}

export const teamsApi = {
  getAll: () => Object.values(teamsData),
  getById: (id: string) => teamsData[id],
}

export const predictApi = {
  submit: (matchId: string, nickname: string, prediction: string) => {
    const match = matchesData.matches.find((m: any) => m.id === matchId)
    if (!match) throw new Error('Match not found')
    
    const teamA = teamsData[match.team_a]
    const teamB = teamsData[match.team_b]
    if (!teamA || !teamB) throw new Error('Team not found')
    
    predictions[matchId] = {
      ...calculateWinProbability(teamA, teamB),
      user_prediction: prediction,
      nickname
    }
    return predictions[matchId]
  },
  getByMatch: (matchId: string) => {
    const match = matchesData.matches.find((m: any) => m.id === matchId)
    if (!match) return null
    
    const teamA = teamsData[match.team_a]
    const teamB = teamsData[match.team_b]
    if (!teamA || !teamB) return null
    
    return calculateWinProbability(teamA, teamB)
  },
}

export const predictionsApi = {
  getByDeviceId: () => Object.values(predictions)
}

export const leaderboardApi = {
  getTop20: () => [
    { nickname: '足球专家', correct_count: 12, total_count: 15, current_streak: 5 },
    { nickname: '预言帝', correct_count: 10, total_count: 14, current_streak: 3 },
    { nickname: '数据控', correct_count: 9, total_count: 13, current_streak: 2 },
    { nickname: '直觉王', correct_count: 8, total_count: 12, current_streak: 1 },
    { nickname: '球迷小李', correct_count: 7, total_count: 11, current_streak: 0 },
  ]
}
