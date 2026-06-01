"""
预测路由
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class PredictRequest(BaseModel):
    team_a: str
    team_b: str
    model: Optional[str] = 'squad'  # 'historic' or 'squad'

@router.post("/")
async def predict(request: PredictRequest):
    """提交预测请求"""
    from services.prediction import calculate_prediction

    result = calculate_prediction(request.team_a, request.team_b, request.model)
    if result is None:
        raise HTTPException(status_code=404, detail="Team not found")

    return result

@router.get("/{match_id}")
async def get_prediction(match_id: str):
    """获取指定比赛的预测"""
    from services.prediction import calculate_prediction
    import json
    import os

    # 获取比赛信息
    data_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data')
    with open(os.path.join(data_dir, 'matches.json'), 'r') as f:
        matches = json.load(f)

    match = None
    for m in matches:
        if m.get('id') == match_id:
            match = m
            break

    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")

    team_a = match.get('team_a')
    team_b = match.get('team_b')

    # 计算预测
    result = calculate_prediction(team_a, team_b, 'squad')
    if result is None:
        raise HTTPException(status_code=404, detail="Team not found")

    result['match'] = match
    return result