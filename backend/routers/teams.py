"""
球队路由
"""
from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter()

def get_teams():
    data_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data')
    with open(os.path.join(data_dir, 'teams.json'), 'r') as f:
        return json.load(f)

@router.get("/")
async def get_teams_list():
    """获取所有球队列表"""
    teams = get_teams()
    return list(teams.values())

@router.get("/{team_id}")
async def get_team(team_id: str):
    """获取单个球队详情"""
    teams = get_teams()
    if team_id not in teams:
        raise HTTPException(status_code=404, detail="Team not found")

    team = teams[team_id]

    # 计算实力评分
    from services.prediction import get_strength_scores
    scores = get_strength_scores(team_id)
    if scores:
        team['strength_score'] = scores

    return team