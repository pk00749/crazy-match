import teamsData from '../data/teams.json'
import matchesData from '../data/matches.json'

// 预测算法 v3.0 - 基于真实数据

// 真实世界杯冠军加成 (截至2022年)
function getTitlesBonus(teamId: string): number {
  const titles: Record<string, number> = {
    BRA: 18,   // 5次冠军: 1958, 1962, 1970, 1994, 2002
    GER: 14,   // 4次冠军: 1954, 1974, 1990, 2014 (含西德)
    ITA: 14,   // 4次冠军: 1934, 1938, 1982, 2006
    ARG: 10,   // 3次冠军: 1978, 1986, 2022
    FRA: 7,    // 2次冠军: 1998, 2018
    URU: 7,    // 2次冠军: 1930, 1950
    ENG: 4,    // 1次冠军: 1966
    ESP: 4,    // 1次冠军: 2010
  }
  return titles[teamId] || 0
}

// 真实历史胜率加成 (基于1930-2022数据)
function getWinRateBonus(teamId: string): number {
  const winRates: Record<string, number> = {
    BRA: 12, ARG: 10, GER: 10, ITA: 9, FRA: 9, ENG: 8, URU: 8, ESP: 8,
    NED: 7, BEL: 6, POR: 6, CRO: 6, COL: 6, MEX: 6, USA: 5, SUI: 5,
    SWE: 5, POL: 5, CHI: 5, AUT: 4, KOR: 4, ECU: 4, AUS: 4, JPN: 3,
    SEN: 3, MAR: 3, NGA: 3, GHA: 3, CMR: 3, TUN: 3, EGY: 2, ALG: 2,
    IRN: 2, KSA: 2, PAR: 2, ROU: 2, DEN: 2, SCO: 2, RUS: 2,
  }
  return winRates[teamId] || 0
}

// 近期表现加成 (基于2022年世界杯表现)
function getRecentPerformanceBonus(teamId: string): number {
  const recent: Record<string, number> = {
    ARG: 10,   // 2022冠军
    FRA: 9,    // 2022亚军
    MAR: 8,    // 2022四强
    CRO: 7,    // 2022四强
    ENG: 6,    // 2022八强
    NED: 5,    // 2022八强
    USA: 5,    // 2022十六强
    SEN: 5,    // 2022十六强
    POL: 4,    // 2022十六强
    AUS: 4,    // 2022十六强
    BRA: 4,    // 2022八强
    POR: 3,    // 2022十六强
    JPN: 3,    // 2022十六强
    KOR: 2,    // 2022小组赛
    GER: 2,    // 2022小组赛
    BEL: 1,    // 2022小组赛
  }
  return recent[teamId] || 0
}

function calculateHistoricScore(team: any): number {
  // 基础分: 基于FIFA排名
  const baseScore = Math.max(20, 100 - (team.fifa_rank || 50))
  
  // 冠军加成
  const titlesBonus = getTitlesBonus(team.id)
  
  // 胜率加成
  const winRateBonus = getWinRateBonus(team.id)
  
  // 近期表现加成
  const recentBonus = getRecentPerformanceBonus(team.id)
  
  return Math.min(100, Math.round(baseScore + titlesBonus + winRateBonus + recentBonus))
}

function calculateSquadScore(team: any): number {
  // FIFA排名分 × 30%
  const rankScore = Math.max(10, 100 - (team.fifa_rank || 50)) * 0.3
  
  // 综合实力评分 × 70%
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
  
  // 使用logistic函数计算基础胜率
  const baseWinRate = 1 / (1 + Math.pow(10, -diff / 15))
  
  // 东道主加成 (2026美墨加)
  const homeBonus = getHomeBonus(teamA.id, teamB.id)
  const adjustedWinRate = Math.min(0.95, Math.max(0.05, baseWinRate + homeBonus))
  
  // 平局概率: 差值越小平局概率越高
  const drawChance = Math.max(5, Math.min(30, Math.round(20 - Math.abs(diff) / 10)))
  
  // 计算双方胜率
  const teamAWinFloat = adjustedWinRate * (100 - drawChance)
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

const predictions: Record<string, any> = {}

export const matchesApi = {
  getAll: () => matchesData.matches,
  getByDate: (date: string) => matchesData.matches.filter((m: any) => m.date === date),
  getById: (id: string) => matchesData.matches.find((m: any) => m.id === id),
}

export const teamsApi = {
  getAll: () => Object.values(teamsData),
  getById: (id: string) => (teamsData as any)[id],
}

export const predictApi = {
  submit: (matchId: string, nickname: string, prediction: string) => {
    const match = matchesData.matches.find((m: any) => m.id === matchId)
    if (!match) throw new Error('Match not found')
    
    const teamA = (teamsData as any)[match.team_a]
    const teamB = (teamsData as any)[match.team_b]
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
    
    const teamA = (teamsData as any)[match.team_a]
    const teamB = (teamsData as any)[match.team_b]
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
