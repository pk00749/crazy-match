import json
import os
from typing import List, Optional, Dict

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')

def _load_json(filename: str) -> dict:
    path = os.path.join(DATA_DIR, filename)
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

# 球队数据
_teams_cache = None

def load_teams() -> List[dict]:
    global _teams_cache
    if _teams_cache is None:
        data = _load_json('teams.json')
        _teams_cache = list(data.values())
    return _teams_cache

def load_team_by_id(team_id: str) -> Optional[dict]:
    teams = load_teams()
    return next((t for t in teams if t['id'] == team_id), None)

# 比赛数据
_matches_cache = None

def load_matches() -> List[dict]:
    global _matches_cache
    if _matches_cache is None:
        data = _load_json('matches.json')
        _matches_cache = data.get('matches', [])
    return _matches_cache

def load_match_by_id(match_id: str) -> Optional[dict]:
    matches = load_matches()
    return next((m for m in matches if m['id'] == match_id), None)

# 历史战绩
_historic_cache = None

def load_historic_records() -> Dict:
    global _historic_cache
    if _historic_cache is None:
        _historic_cache = _load_json('historic_records.json')
    return _historic_cache