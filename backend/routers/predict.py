from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models import ApiResponse
from data_loader import load_team_by_id
from services.prediction import calculate_prediction

router = APIRouter()

class PredictRequest(BaseModel):
    team_a_id: str
    team_b_id: str

@router.post("/predict")
async def predict_match(request: PredictRequest):
    """提交两支球队，返回预测结果"""
    team_a = load_team_by_id(request.team_a_id)
    team_b = load_team_by_id(request.team_b_id)

    if not team_a or not team_b:
        raise HTTPException(status_code=404, detail="Team not found")

    result = calculate_prediction(team_a, team_b)
    return ApiResponse(success=True, data=result, timestamp="2026-06-03")

@router.get("/predict/{match_id}")
async def get_match_prediction(match_id: str):
    """获取单场比赛预测（需要先获取比赛的两支球队）"""
    from data_loader import load_match_by_id

    match = load_match_by_id(match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    team_a = load_team_by_id(match['team_a'])
    team_b = load_team_by_id(match['team_b'])

    if not team_a or not team_b:
        raise HTTPException(status_code=404, detail="Team not found")

    result = calculate_prediction(team_a, team_b)
    result['match'] = match
    return ApiResponse(success=True, data=result, timestamp="2026-06-03")
