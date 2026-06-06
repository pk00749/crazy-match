import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import TeamModal from './TeamModal'

interface MatchCardProps {
  match: {
    id: string
    team_a: string   // Chinese name
    team_b: string   // Chinese name
    team_a_code: string  // 3-letter code for flag and squad lookup
    team_b_code: string
    time: string
    venue: string
    city?: string
    date?: string
    stage: string
    group?: string
  }
  isSelected?: boolean
  prediction?: any
  onPredict?: (matchId: string) => void
  onShare?: (matchId: string) => void
  onSelect?: (matchId: string) => void
}

interface Prediction {
  id: string
  match_id: string
  nickname: string
  predicted_winner: string
  created_at: string
}

interface LeaderboardEntry {
  device_id: string
  nickname: string
  correct_count: number
  total_count: number
  current_streak: number
}

// Placeholder codes for knockout stage teams (no squad data)
const PLACEHOLDER_CODES = new Set([
  'A1','C2','D3','E1','G2','H3','I1','K2','L1','J2','B1','F2',
  'A2','E2','G1','H1','K1','I2','J1','L2','B2','D1','A3','C1',
  'D2','F1','H2','G3',
  'W49','W50','W51','W52','W53','W54','W55','W56','W57','W58',
  'W59','W60','W61','W62','W63','W64','W65','W66','W67','W68',
])

function isPlaceholder(code: string): boolean {
  return PLACEHOLDER_CODES.has(code)
}

// Team 3-letter code -> 2-letter ISO flag code
const flagCodeMap: Record<string, string> = {
  ALG:'dz', ARG:'ar', AUS:'au', AUT:'at', BEL:'be', BIH:'ba', BRA:'br', CAN:'ca',
  CHI:'cl', CMR:'cm', COD:'cd', COL:'co', CPV:'cv', CRO:'hr', CUR:'cw', CZE:'cz',
  ECU:'ec', EGY:'eg', ENG:'gb-eng', ESP:'es', FRA:'fr', GER:'de', GHA:'gh',
  HAI:'ht', HUN:'hu', INA:'id', IRL:'ie', IRN:'ir', IRQ:'iq', ITA:'it',
  JOR:'jo', JPN:'jp', KOR:'kr', KSA:'sa', MAR:'ma', MEX:'mx', NED:'nl',
  NGA:'ng', NOR:'no', NZL:'nz', PAN:'pa', PAR:'py', PER:'pe', POL:'pl',
  POR:'pt', QAT:'qa', ROU:'ro', RSA:'za', SCO:'gb-sct', SEN:'sn', SRB:'rs',
  SUI:'ch', SWE:'se', TUN:'tn', TUR:'tr', UAE:'ae', URU:'uy', USA:'us',
  UZB:'uz', VEN:'ve', WAL:'gb-wls', CIV:'ci',
}

function getTeamFlagUrl(code: string): string {
  if (!code) return ''
  const mapped = flagCodeMap[code]
  if (mapped) return `https://flagcdn.com/w80/${mapped}.png`
  return `https://flagcdn.com/w80/${code.toLowerCase()}.png`
}

function getStageLabel(stage: string): string {
  const map: Record<string, string> = {
    group: '小组赛', round16: '1/8决赛', quarter: '1/4决赛', semi: '半决赛', final: '决赛'
  }
  return map[stage] || stage
}

function getBadgeClass(w: string, teamAName: string, teamBName: string): string {
  if (w === 'draw') return 'badge-draw'
  if (w === teamAName) return 'badge-teamA'
  return 'badge-teamB'
}

function getBadgeLabel(w: string, teamAName: string, teamBName: string): string {
  if (w === 'draw') return '平局'
  if (w === teamAName) return teamAName
  if (w === teamBName) return teamBName
  return w
}

export default function MatchCard({ match, isSelected, prediction, onPredict, onShare, onSelect }: MatchCardProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [activeTab, setActiveTab] = useState<'pred' | 'rank'>('pred')
  const [loading, setLoading] = useState(false)
  const [showTeamA, setShowTeamA] = useState(false)
  const [showTeamB, setShowTeamB] = useState(false)

  const { team_a_code, team_b_code } = match
  const canShowTeamA = !isPlaceholder(team_a_code)
  const canShowTeamB = !isPlaceholder(team_b_code)

  useEffect(() => {
    if (isSelected) loadData()
  }, [isSelected, match.id])

  const loadData = async () => {
    setLoading(true)
    try {
      const [{ data: pd }, { data: lb }] = await Promise.all([
        supabase.from('predictions').select('*').eq('match_id', match.id).order('created_at', { ascending: false }).limit(15),
        supabase.from('leaderboard_stats').select('*').order('correct_count', { ascending: false }).limit(10),
      ])
      setPredictions(pd || [])
      setLeaderboard(lb || [])
    } catch (e) { /* silent */ }
    finally { setLoading(false) }
  }

  return (
    <>
      <div
        className={`match-card${isSelected ? ' selected' : ''}`}
        onClick={() => onSelect?.(match.id)}
      >
        {/* Top badges */}
        <div className="match-card-top">
          <div className="match-badges">
            <span className={`badge ${match.stage === 'final' ? 'badge-final' : match.stage === 'group' ? 'badge-group' : 'badge-knockout'}`}>
              {getStageLabel(match.stage)}
            </span>
            {match.stage === 'group' && match.group && (
              <span className="badge badge-group">{match.group}组</span>
            )}
          </div>
        </div>

        {/* Teams */}
        <div className="match-teams">
          <div className="team team-a">
            <img className="team-flag" src={getTeamFlagUrl(team_a_code)} alt={match.team_a} loading="lazy" />
            <div>
              <span className="team-name">{match.team_a}</span>
              {canShowTeamA && (
                <div className="team-name-hint" onClick={(e) => { e.stopPropagation(); setShowTeamA(true) }}>
                  👤 点击查看阵容
                </div>
              )}
            </div>
          </div>
          <span className="match-vs">VS</span>
          <div className="team team-b">
            <div style={{ textAlign: 'right' }}>
              <span className="team-name">{match.team_b}</span>
              {canShowTeamB && (
                <div className="team-name-hint team-name-hint-right" onClick={(e) => { e.stopPropagation(); setShowTeamB(true) }}>
                  点击查看阵容 👤
                </div>
              )}
            </div>
            <img className="team-flag" src={getTeamFlagUrl(team_b_code)} alt={match.team_b} loading="lazy" />
          </div>
        </div>

        {/* Meta */}
        <div className="match-meta">
          {match.time && <span className="meta-item">🕐 {match.time}</span>}
          {match.venue && <span className="meta-item">📍 {match.venue}{match.city ? ` · ${match.city}` : ''}</span>}
        </div>

        {/* Expanded content */}
        {isSelected && (
          <div onClick={e => e.stopPropagation()}>
            {prediction && (
              <div className="match-expanded">
                <div className="prob-bar">
                  {[
                    { pct: prediction.win_probability?.team_a || 0, cls: 'win' },
                    { pct: prediction.win_probability?.draw || 0, cls: 'draw' },
                    { pct: prediction.win_probability?.team_b || 0, cls: 'lose' },
                  ].map(s => (
                    <div key={s.cls} className={`prob-segment ${s.cls}`} style={{ flexBasis: `${s.pct}%` }}>
                      {s.pct >= 10 && <span>{Math.round(s.pct)}%</span>}
                    </div>
                  ))}
                </div>
                <div className="prob-labels">
                  {[match.team_a, '平局', match.team_b].map((name, i) => (
                    <span key={name} className={`prob-label ${['win','draw','lose'][i]}`}>{name}</span>
                  ))}
                </div>
                <div className="strength-row">
                  <span className="strength-num">{prediction.strength_rating?.team_a || 0}</span>
                  <div className="strength-bar-track">
                    <div className="strength-bar-fill" style={{ width: `${prediction.strength_rating?.team_a || 0}%` }} />
                  </div>
                  <span className="strength-vs">⚽</span>
                  <div className="strength-bar-track">
                    <div className="strength-bar-fill" style={{ width: `${prediction.strength_rating?.team_b || 0}%` }} />
                  </div>
                  <span className="strength-num">{prediction.strength_rating?.team_b || 0}</span>
                </div>
              </div>
            )}

            <div className="card-tabs">
              <button className={`card-tab ${activeTab === 'pred' ? 'active' : ''}`} onClick={() => setActiveTab('pred')}>
                本场预测 ({predictions.length})
              </button>
              <button className={`card-tab ${activeTab === 'rank' ? 'active' : ''}`} onClick={() => setActiveTab('rank')}>
                排行榜
              </button>
            </div>

            <div className="card-data">
              {activeTab === 'pred' ? (
                loading ? <div className="mini-loading">⚽ 加载中...</div> :
                predictions.length === 0 ? <div className="mini-empty">暂无预测，快来成为第一个预言家！</div> :
                predictions.map(p => (
                  <div key={p.id} className="pred-item">
                    <span className="pred-nick">{p.nickname}</span>
                    <span className={`pred-badge ${getBadgeClass(p.predicted_winner, match.team_a, match.team_b)}`}>
                      {getBadgeLabel(p.predicted_winner, match.team_a, match.team_b)}
                    </span>
                  </div>
                ))
              ) : (
                loading ? <div className="mini-loading">⚽ 加载中...</div> :
                leaderboard.length === 0 ? <div className="mini-empty">暂无排行</div> :
                leaderboard.map((e, i) => (
                  <div key={e.device_id} className="rank-item">
                    <span className="rank-pos">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
                    <span className="rank-nick">{e.nickname}</span>
                    <span className="rank-stats">
                      {e.total_count > 0 ? `${Math.round(e.correct_count / e.total_count * 100)}%` : '0%'}
                      {e.current_streak > 0 && ` 🔥${e.current_streak}`}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="match-actions">
              <button className="btn btn-predict" onClick={() => onPredict?.(match.id)}>📝 预测</button>
              {onShare && <button className="btn btn-share" onClick={() => onShare?.(match.id)}>🔗 分享</button>}
            </div>
          </div>
        )}
      </div>

      {canShowTeamA && showTeamA && (
        <TeamModal teamCode={team_a_code} teamName={match.team_a} onClose={() => setShowTeamA(false)} />
      )}
      {canShowTeamB && showTeamB && (
        <TeamModal teamCode={team_b_code} teamName={match.team_b} onClose={() => setShowTeamB(false)} />
      )}
    </>
  )
}
