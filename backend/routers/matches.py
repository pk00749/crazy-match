from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from models import Match, ApiResponse
from data_loader import load_matches, load_match_by_id

router = APIRouter()

@router.get("/matches")
async def get_matches(date: Optional[str] = Query(None, description="筛选日期 YYYY-MM-DD")):
    """获取所有比赛或按日期筛选"""
    matches = load_matches()
    if date:
        matches = [m for m in matches if m['date'] == date]
    return ApiResponse(success=True, data=matches, timestamp="2026-06-03")

@router.get("/matches/{match_id}")
async def get_match(match_id: str):
    """获取单场比赛"""
    match = load_match_by_id(match_id)
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    return ApiResponse(success=True, data=match, timestamp="2026-06-03")