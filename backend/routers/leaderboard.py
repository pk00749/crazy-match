from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models import ApiResponse
from dotenv import load_dotenv
from supabase import create_client
import os

load_dotenv()

router = APIRouter()

def get_supabase_client():
    """Lazy initialization of Supabase client"""
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_ANON_KEY')
    if not supabase_url or not supabase_key or supabase_url == 'https://placeholder.supabase.co':
        return None
    return create_client(supabase_url, supabase_key)

@router.get("/leaderboard")
async def get_leaderboard():
    """获取排行榜（调用 Supabase RPC）"""
    supabase = get_supabase_client()
    if not supabase:
        return ApiResponse(success=True, data=[], timestamp="2026-06-03")
    try:
        result = supabase.rpc('get_leaderboard').execute()
        return ApiResponse(success=True, data=result.data, timestamp="2026-06-03")
    except Exception as e:
        return ApiResponse(success=False, error={'code': 'DB_ERROR', 'message': str(e)}, timestamp="2026-06-03")

@router.get("/predictions/{device_id}")
async def get_user_predictions(device_id: str):
    """获取某用户预测记录"""
    supabase = get_supabase_client()
    if not supabase:
        return ApiResponse(success=True, data=[], timestamp="2026-06-03")
    try:
        result = supabase.table('predictions').select('*').eq('device_id', device_id).execute()
        return ApiResponse(success=True, data=result.data, timestamp="2026-06-03")
    except Exception as e:
        return ApiResponse(success=False, error={'code': 'DB_ERROR', 'message': str(e)}, timestamp="2026-06-03")

class MatchResultRequest(BaseModel):
    match_id: str
    winner: str  # teamA, teamB, draw

@router.post("/match/{match_id}/result")
async def submit_match_result(match_id: str, request: MatchResultRequest):
    """管理员录入比赛结果，触发准确率计算"""
    supabase = get_supabase_client()
    if not supabase:
        return ApiResponse(success=False, error={'code': 'DB_NOT_CONFIGURED', 'message': 'Supabase not configured'}, timestamp="2026-06-03")
    try:
        predictions = supabase.table('predictions').select('*').eq('match_id', match_id).execute()

        for pred in predictions.data:
            is_correct = pred['predicted_winner'] == request.winner
            supabase.table('predictions').update({'is_correct': is_correct}).eq('id', pred['id']).execute()

        return ApiResponse(success=True, data={'updated': len(predictions.data)}, timestamp="2026-06-03")
    except Exception as e:
        return ApiResponse(success=False, error={'code': 'DB_ERROR', 'message': str(e)}, timestamp="2026-06-03")