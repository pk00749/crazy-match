from pydantic import BaseModel
from typing import Optional, Literal

# 球员
class Player(BaseModel):
    id: str
    name: str
    position: Literal['GK', 'DEF', 'MID', 'FWD']
    age: int
    club: str
    market_value: float  # 身价（万欧元）
    rating: float        # 0-100

# 历史战绩
class HistoricRecord(BaseModel):
    participations: int      # 参赛次数
    championships: int      # 冠军次数
    wins: int               # 胜场
    draws: int              # 平场
    losses: int             # 负场
    goals_scored: int       # 进球
    goals_conceded: int     # 失球
    best_result: str        # 最好成绩
    recent_performance: list[str]  # 近三届成绩

# 球队实力评分
class StrengthScore(BaseModel):
    historic: float   # 历史分 (满分40)
    player: float     # 球员分 (满分60)
    total: float      # 总分 (满分100)

# 球队
class Team(BaseModel):
    id: str
    name: str
    code: str           # 如 "BRA", "ARG"
    flag: str           # 国旗 emoji
    fifa_rank: int
    group: str          # A-L
    historic_record: HistoricRecord
    current_squad: list[Player]
    strength_score: StrengthScore

# 比赛
class Match(BaseModel):
    id: str
    date: str
    time: str
    stage: Literal['group', 'round16', 'quarter', 'semi', 'final']
    group: Optional[str] = None  # A-L (小组赛)
    team_a: str      # 队伍 code
    team_b: str      # 队伍 code
    venue: str
    city: str
    prediction: Optional[dict] = None

# 预测结果
class Prediction(BaseModel):
    model: Literal['historic', 'squad']
    win_probability: dict[str, float]  # {teamA: x, teamB: y, draw: z}
    strength_rating: dict[str, float]  # {teamA: x, teamB: y}
    factors: list[str]       # 预测依据

# 用户预测（localStorage 存储）
class UserPrediction(BaseModel):
    id: str
    match_id: str
    nickname: str
    predicted_winner: Literal['teamA', 'teamB', 'draw']
    predicted_score: Optional[dict[str, int]] = None
    created_at: str

# 用户积分
class UserStats(BaseModel):
    nickname: str
    total_predictions: int
    correct_predictions: int
    current_streak: int
    longest_streak: int