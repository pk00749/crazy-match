import teamsData from '../data/teams.json'
import matchesData from '../data/matches.json'

// Helper to simulate prediction data
function calculatePrediction(teamA: any, teamB: any) {
  const diff = teamA.strengthScore - teamB.strengthScore
  const base = 1 / (1 + Math.pow(10, -diff / 10))
  const teamAWin = Math.round(base * 100)
  const draw = Math.round(Math.random() * 15 + 5)
  const teamBWin = 100 - teamAWin - draw
  
  return {
    win_probability: { team_a: teamAWin, team_b: teamBWin, draw },
    strength_rating: { team_a: teamA.strengthScore, team_b: teamB.strengthScore }
  }
}

// In-memory predictions storage (for MVP)
let predictions: Record<string, any> = {}

export const matchesApi = {
  getAll: () => {
    return matchesData.matches
  },
  getByDate: (date: string) => {
    return matchesData.matches.filter((m: any) => m.date === date)
  },
  getById: (id: string) => {
    return matchesData.matches.find((m: any) => m.id === id)
  }
}

export const teamsApi = {
  getAll: () => {
    return Object.values(teamsData)
  },
  getById: (id: string) => {
    return teamsData[id]
  }
}

export const predictApi = {
  submit: (matchId: string, nickname: string, prediction: string) => {
    const match = matchesData.matches.find((m: any) => m.id === matchId)
    if (!match) throw new Error('Match not found')
    
    const teamA = teamsData[match.team_a]
    const teamB = teamsData[match.team_b]
    if (!teamA || !teamB) throw new Error('Team not found')
    
    predictions[matchId] = {
      ...calculatePrediction(teamA, teamB),
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
    
    return calculatePrediction(teamA, teamB)
  }
}

export const predictionsApi = {
  getByDeviceId: () => Object.values(predictions)
}

export const leaderboardApi = {
  getTop20: () => {
    // Mock leaderboard for MVP
    return [
      { nickname: '足球专家', correct_count: 12, total_count: 15, current_streak: 5 },
      { nickname: '预言帝', correct_count: 10, total_count: 14, current_streak: 3 },
      { nickname: '数据控', correct_count: 9, total_count: 13, current_streak: 2 },
      { nickname: '直觉王', correct_count: 8, total_count: 12, current_streak: 1 },
      { nickname: '球迷小李', correct_count: 7, total_count: 11, current_streak: 0 },
    ]
  }
}
