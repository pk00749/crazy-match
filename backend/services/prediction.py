import math
from typing import Dict, Tuple

# 历史分计算（满分40分）
def calculate_history_score(team_data: dict) -> float:
    """
    冠军次数: 15分（每冠2.5分，上限15）
    参赛次数: 5分（参赛超过15次得满分）
    胜率: 10分（胜率>60%得满分）
    最近表现: 10分（近三届成绩加权）
    """
    score = 0.0

    # 冠军次数（满分15）
    championships = team_data.get('historic_record', {}).get('championships', 0)
    score += min(championships * 2.5, 15)

    # 参赛次数（满分5）
    participations = team_data.get('historic_record', {}).get('participations', 0)
    score += min(participations / 15 * 5, 5)

    # 胜率（满分10）
    wins = team_data.get('historic_record', {}).get('wins', 0)
    total = team_data.get('historic_record', {}).get('wins', 0) + \
            team_data.get('historic_record', {}).get('draws', 0) + \
            team_data.get('historic_record', {}).get('losses', 0)
    if total > 0:
        win_rate = wins / total
        score += min(win_rate / 0.6 * 10, 10)

    # 最近表现（满分10）
    recent = team_data.get('historic_record', {}).get('recent_performance', [])
    performance_map = {'Champion': 10, 'Final': 8, 'Semi-final': 6, 'Quarter-final': 4}
    for i, perf in enumerate(recent[:3]):
        score += performance_map.get(perf, 2) * (0.5 ** i)

    return min(score, 40)

# 球员分计算（满分60分）
def calculate_player_score(team_data: dict) -> float:
    """
    FIFA排名: 15分（排名1得15分，递减）
    五大联赛球员: 15分（每名主力加1-3分）
    身价总和: 15分（身价前三球员加权）
    主教练: 5分（名帅加成）
    阵容深度: 10分（替补席实力）
    """
    score = 0.0

    # FIFA排名（满分15）
    fifa_rank = team_data.get('fifa_rank', 100)
    score += max(15 - (fifa_rank - 1) * 0.15, 0)

    # 球员评分（满分30）
    squad = team_data.get('current_squad', [])
    total_rating = sum(p.get('rating', 0) for p in squad)
    avg_rating = total_rating / len(squad) if squad else 0
    score += min(avg_rating / 100 * 30, 30)

    # 身价总和（满分15）
    total_value = sum(p.get('market_value', 0) for p in squad)
    score += min(total_value / 50000 * 15, 15)  # 假设总身价上限5000万

    return min(score, 60)

# 综合预测计算
def calculate_prediction(home_team_data: dict, away_team_data: dict) -> dict:
    # 历史分（40%）
    home_history = calculate_history_score(home_team_data) * 0.4
    away_history = calculate_history_score(away_team_data) * 0.4

    # 球员分（60%）
    home_player = calculate_player_score(home_team_data) * 0.6
    away_player = calculate_player_score(away_team_data) * 0.6

    # 综合实力分
    home_power = home_history + home_player
    away_power = away_history + away_player

    # 计算胜率（logistic函数）
    power_diff = home_power - away_power
    home_win_prob = 1 / (1 + 10 ** (-power_diff / 3))
    away_win_prob = 1 / (1 + 10 ** (-(-power_diff) / 3))
    draw_prob = 0.15  # 平局假设

    # 归一化
    total = home_win_prob + away_win_prob + draw_prob
    home_win_prob = home_win_prob / total
    away_win_prob = away_win_prob / total
    draw_prob = draw_prob / total

    return {
        'model': 'combined',
        'win_probability': {
            'team_a': round(home_win_prob * 100, 1),
            'team_b': round(away_win_prob * 100, 1),
            'draw': round(draw_prob * 100, 1)
        },
        'strength_rating': {
            'team_a': round(home_power, 1),
            'team_b': round(away_power, 1)
        },
        'factors': [
            f'历史战绩: {round(home_history, 1)} vs {round(away_history, 1)}',
            f'球员实力: {round(home_player, 1)} vs {round(away_player, 1)}'
        ]
    }