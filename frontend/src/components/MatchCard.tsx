import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import TeamModal from './TeamModal'

interface MatchCardProps {
  match: {
    id: string
    team_a: string
    team_b: string
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

const flagBase = 'https://flagcdn.com/w160/'

// 3-letter team code -> 2-letter ISO flag code
const flagCodeMap: Record<string, string> = {
  ALG:'dz', ARG:'ar', AUS:'au', AUT:'at', BEL:'be', BIH:'ba', BRA:'br', CAN:'ca',
  CMR:'cm', COL:'co', CRO:'hr', ECU:'ec', EGY:'eg', ENG:'gb-eng', ESP:'es', FRA:'fr',
  GER:'de', GHA:'gh', HUN:'hu', INA:'id', IRL:'ie', IRN:'ir', ITA:'it', JPN:'jp',
  KOR:'kr', KSA:'sa', MAR:'ma', MEX:'mx', NED:'nl', NGA:'ng', NOR:'no', NZL:'nz',
  PAR:'py', PER:'pe', POL:'pl', POR:'pt', QAT:'qa', ROU:'ro', RSA:'za', SEN:'sn',
  SRB:'rs', SUI:'ch', UAE:'ae', URU:'uy', USA:'us', VEN:'ve', WAL:'gb-wls', CHI:'cl'
}

function getTeamFlagUrl(code: string): string {
  if (!code) return ''
  const mapped = flagCodeMap[code]
  if (mapped) return `${flagBase}${mapped}.png`
  return `${flagBase}${code.toLowerCase()}.png`
}

function getStageLabel(stage: string): string {
  const map: Record<string, string> = {
    group: '小组赛', round16: '1/8决赛', quarter: '1/4决赛', semi: '半决赛', final: '决赛'
  }
  return map[stage] || stage
}

export default function MatchCard({ match, isSelected, prediction, onPredict, onShare, onSelect }: MatchCardProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [activeTab, setActiveTab] = useState<'pred' | 'rank'>('pred')
  const [loading, setLoading] = useState(false)
  const [showTeamA, setShowTeamA] = useState(false)
  const [showTeamB, setShowTeamB] = useState(false)

  useEffect(() => {
    if (isSelected) loadData()
  }, [isSelected, match.id])

  const loadData = async () => {
    setLoading(true)
    try {
      const [{ data: pd }, { data: lb }] = await Promise.all([
        supabase.from('predictions').select('*').eq('match_id', match.id).order('created_at', { ascending: false }).limit(20),
        supabase.from('leaderboard_stats').select('*').order('correct_count', { ascending: false }).limit(10),
      ])
      setPredictions(pd || [])
      setLeaderboard(lb || [])
    } catch (e) { /* silent */ }
    finally { setLoading(false) }
  }

  const getBadge = (w: string) => {
    if (w === 'draw') return 'badge-draw'
    if (w === match.team_a) return 'badge-teamA'
    return 'badge-teamB'
  }

  const getLabel = (w: string) => {
    if (w === 'draw') return '平局'
    if (w === match.team_a) return match.team_a
    if (w === match.team_b) return match.team_b
    return w
  }

  return (
    <>
      <div className={`match-card${isSelected ? ' selected' : ''}`} onClick={() => onSelect?.(match.id)}>
        {/* Stage badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span className={`stage-badge ${match.stage}`}>
            {match.stage === 'final' ? '🏆' : match.stage === 'semi' ? '⭐' : match.stage === 'quarter' ? '💎' : match.stage === 'round16' ? '⚡' : '🔵'} {getStageLabel(match.stage)}
          </span>
          {match.stage === 'group' && match.group && (
            <span className="stage-badge group">{match.group}组</span>
          )}
        </div>

        {/* Teams */}
        <div className="match-teams">
          <div className="team-block team-a">
            <div className="team-flag-wrap">
              <img className="team-flag-img" src={getTeamFlagUrl(match.team_a)} alt={match.team_a} loading="lazy" />
            </div>
            <div className="team-name-wrap">
              <div className="team-name-main" onClick={(e) => { e.stopPropagation(); setShowTeamA(true) }}>
                {match.team_a}
                <div className="team-name-hint">👤 点击查看阵容</div>
              </div>
            </div>
          </div>

          <div className="match-vs-center">
            <div className="match-vs-ball">⚽</div>
            <div className="match-vs-text">VS</div>
          </div>

          <div className="team-block team-b">
            <div className="team-name-wrap" style={{ textAlign: 'right' }}>
              <div className="team-name-main" onClick={(e) => { e.stopPropagation(); setShowTeamB(true) }}>
                <div className="team-name-hint" style={{ textAlign: 'right' }}>点击查看阵容 👤</div>
                {match.team_b}
              </div>
            </div>
            <div className="team-flag-wrap">
              <img className="team-flag-img" src={getTeamFlagUrl(match.team_b)} alt={match.team_b} loading="lazy" />
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="match-meta-row">
          {match.time && <span className="match-meta-item"><span className="emoji">🕐</span>{match.time}</span>}
          {match.venue && <span className="match-meta-item"><span className="emoji">📍</span>{match.venue}{match.city ? ` · ${match.city}` : ''}</span>}
          {match.date && <span className="match-meta-item"><span className="emoji">📅</span>{match.date}</span>}
        </div>

        {/* Selected: prediction + tabs */}
        {isSelected && (
          <div onClick={e => e.stopPropagation()}>
            {prediction && (
              <div className="prob-section">
                <div className="prob-bar-wrap">
                  {[
                    { pct: prediction.win_probability?.team_a || 0, cls: 'win', label: match.team_a },
                    { pct: prediction.win_probability?.draw || 0, cls: 'draw', label: '平局' },
                    { pct: prediction.win_probability?.team_b || 0, cls: 'lose', label: match.team_b },
                  ].map(s => (
                    <div key={s.cls} className={`prob-segment ${s.cls}`} style={{ flexBasis: `${s.pct}%` }}>
                      {s.pct >= 15 && <span>{Math.round(s.pct)}%</span>}
                    </div>
                  ))}
                </div>
                <div className="prob-labels-row">
                  {[match.team_a, '平局', match.team_b].map((name, i) => (
                    <span key={name} className={`prob-label-name ${['win','draw','lose'][i]}`}>{name}</span>
                  ))}
                </div>

                <div className="strength-row">
                  <span className="strength-num">{prediction.strength_rating?.team_a || 0}</span>
                  <div className="strength-bar-wrap">
                    <div className="strength-bar-track">
                      <div className="strength-bar-fill" style={{ width: `${prediction.strength_rating?.team_a || 0}%` }} />
                    </div>
                    <span className="strength-vs">⚽</span>
                    <div className="strength-bar-track">
                      <div className="strength-bar-fill" style={{ width: `${prediction.strength_rating?.team_b || 0}%` }} />
                    </div>
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
                🏅 排行榜
              </button>
            </div>

            <div className="card-data">
              {activeTab === 'pred' ? (
                loading ? <div className="mini-loading">⚽ 加载中...</div> :
                predictions.length === 0 ? <div className="mini-empty">暂无预测，成为第一个预言家！</div> :
                predictions.map(p => (
                  <div key={p.id} className="pred-mini-item">
                    <span className="pred-mini-nick">{p.nickname}</span>
                    <span className={`pred-mini-badge ${getBadge(p.predicted_winner)}`}>{getLabel(p.predicted_winner)}</span>
                  </div>
                ))
              ) : (
                loading ? <div className="mini-loading">⚽ 加载中...</div> :
                leaderboard.length === 0 ? <div className="mini-empty">暂无排行</div> :
                leaderboard.map((e, i) => (
                  <div key={e.device_id} className={`rank-mini-item${i === 0 ? ' top1' : ''}`}>
                    <span className="rank-mini-pos">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
                    <span className="rank-mini-nick">{e.nickname}</span>
                    <span className="rank-mini-stats">
                      {e.total_count > 0 ? `${Math.round(e.correct_count / e.total_count * 100)}%` : '0%'}
                      {e.current_streak > 0 && ` 🔥${e.current_streak}`}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="match-actions">
              <button className="btn-predict" onClick={() => onPredict?.(match.id)}>📝 预测</button>
              <button className="btn-share" onClick={() => onShare?.(match.id)}>🔗 分享</button>
            </div>
          </div>
        )}

        {!isSelected && <div className="match-hint">⚽ 点击查看预测详情 &amp; 阵容</div>}
      </div>

      {showTeamA && <TeamModal teamCode={match.team_a} teamName={match.team_a} onClose={() => setShowTeamA(false)} />}
      {showTeamB && <TeamModal teamCode={match.team_b} teamName={match.team_b} onClose={() => setShowTeamB(false)} />}
    </>
  )
}
