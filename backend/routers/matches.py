"""
比赛路由
"""
from fastapi import APIRouter, Query
import json
import os
from typing import Optional

router = APIRouter()

def get_matches():
    data_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data')
    with open(os.path.join(data_dir, 'matches.json'), 'r') as f:
        return json.load(f)

@router.get("/")
async def get_matches_list(
    date: Optional[str] = Query(None, description="Filter by date (YYYY-MM-DD)"),
    stage: Optional[str] = Query(None, description="Filter by stage"),
    group: Optional[str] = Query(None, description="Filter by group")
):
    """获取比赛列表，支持按日期、阶段、小组筛选"""
    matches = get_matches()

    if date:
        matches = [m for m in matches if m.get('date') == date]
    if stage:
        matches = [m for m in matches if m.get('stage') == stage]
    if group:
        matches = [m for m in matches if m.get('group') == group.upper()]

    return matches

@router.get("/{match_id}")
async def get_match(match_id: str):
    """获取单场比赛详情"""
    matches = get_matches()
    for match in matches:
        if match.get('id') == match_id:
            return match

    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Match not found")