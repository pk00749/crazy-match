from fastapi import APIRouter, HTTPException
from models import ApiResponse
from data_loader import load_teams, load_team_by_id, load_historic_records

router = APIRouter()

@router.get("/teams")
async def get_teams():
    """获取所有球队列表"""
    teams = load_teams()
    return ApiResponse(success=True, data=teams, timestamp="2026-06-03")

@router.get("/teams/{team_id}")
async def get_team(team_id: str):
    """获取球队详情+历史成绩"""
    team = load_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # 附加历史战绩
    historic = load_historic_records().get(team_id, {})
    team['historic_record'] = historic

    return ApiResponse(success=True, data=team, timestamp="2026-06-03")
