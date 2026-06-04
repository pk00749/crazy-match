from pydantic import BaseModel
from typing import Optional, List, Generic, TypeVar

T = TypeVar('T')

# 泛型响应格式
class ApiResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[dict] = None
    timestamp: str

# 历史战绩
class HistoricRecord(BaseModel):
    participations: int
    championships: int
    wins: int
    draws: int
    losses: int
    goals_scored: int
    goals_conceded: int
    best_result: str
    recent_performance: List[str]

# 球员
class Player(BaseModel):
    id: str
    name: str
    position: str  # GK, DEF, MID, FWD
    age: int
    club: str
    market_value: float  # 万欧元
    rating: int  # 0-100

# 球队
class Team(BaseModel):
    id: str
    name: str
    code: str
    flag: str
    fifa_rank: int
    group: str
    historic_record: Optional[HistoricRecord] = None
    current_squad: List[Player] = []
    strength_score: int  # 100分制

# 比赛
class Match(BaseModel):
    id: str
    date: str
    time: str
    stage: str  # group, round16, quarter, semi, final
    group: Optional[str] = None
    team_a: str
    team_b: str
    venue: str
    city: str

# 预测结果
class PredictionResult(BaseModel):
    model: str  # historic, squad, combined
    win_probability: dict  # {team_a: float, team_b: float, draw: float}
    strength_rating: dict  # {team_a: int, team_b: int}
    factors: List[str]

# 用户预测（Supabase 存储）
class UserPrediction(BaseModel):
    id: str
    match_id: str
    device_id: str
    nickname: str
    predicted_winner: str  # teamA, teamB, draw
    created_at: str
    is_correct: Optional[bool] = None
