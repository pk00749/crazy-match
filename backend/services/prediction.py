"""
预测服务 - 核心预测算法实现
"""
import json
import math

# 加载数据
def load_teams():
    with open('data/teams.json', 'r') as f:
        return json.load(f)

def load_matches():
    with open('data/matches.json', 'r') as f:
        return json.load(f)

def calculate_history_score(team_data):
    """
    历史分计算（满分40）
    - 冠军次数: 15分 (每冠2.5分，上限15)
    - 参赛次数: 5分 (参赛超过15次得满分)
    - 胜率: 10分 (胜率>60%得满分)
    - 最近表现: 10分 (近三届成绩加权)
    """
    hr = team_data.get('historic_record', {})

    # 冠军次数 (上限15分)
    championships = hr.get('championships', 0)
    champ_score = min(15, championships * 2.5)

    # 参赛次数 (上限5分)
    participations = hr.get('participations', 0)
    part_score = min(5, participations * 0.33)

    # 胜率 (上限10分)
    wins = hr.get('wins', 0)
    draws = hr.get('draws', 0)
    losses = hr.get('losses', 0)
    total_games = wins + draws + losses
    win_rate = wins / total_games if total_games > 0 else 0
    win_score = min(10, win_rate * 16.67)  # 60%胜率得10分

    # 最近表现 (上限10分)
    recent = hr.get('recent_performance', [])
    recent_score = 0
    for i, result in enumerate(recent[:3]):
        if '冠军' in result:
            recent_score += (3 - i) * 3
        elif '亚军' in result:
            recent_score += (3 - i) * 2
        elif '4强' in result:
            recent_score += (3 - i) * 1.5
        elif '8强' in result:
            recent_score += (3 - i) * 1
    recent_score = min(10, recent_score)

    return champ_score + part_score + win_score + recent_score

def calculate_player_score(team_data):
    """
    球员分计算（满分60）
    - FIFA排名: 15分 (排名1得15分，递减)
    - 球员评分: 30分 (根据阵容平均评分)
    - 阵容深度: 10分 (替补席实力)
    - 身价: 5分 (球队总身价)
    """
    fifa_rank = team_data.get('fifa_rank', 100)

    # FIFA排名分 (上限15分)
    rank_score = max(0, 15 - (fifa_rank - 1) * 0.15)

    # 球员评分 (上限30分)
    players = team_data.get('current_squad', [])
    if players:
        avg_rating = sum(p.get('rating', 70) for p in players) / len(players)
        rating_score = min(30, avg_rating * 0.35)
    else:
        rating_score = 0

    # 阵容深度 (上限10分) - 替补球员平均分
    if len(players) >= 11:
        bench_players = players[11:16]  # 5名替补
        bench_avg = sum(p.get('rating', 70) for p in bench_players) / len(bench_players)
        depth_score = min(10, bench_avg * 0.14)
    else:
        depth_score = 0

    # 身价分 (上限5分)
    total_value = sum(p.get('market_value', 0) for p in players)
    value_score = min(5, total_value / 10000)

    return rank_score + rating_score + depth_score + value_score

def calculate_prediction(team_a_code, team_b_code, model='historic'):
    """
    计算预测结果
    使用 logistic 函数计算胜率
    """
    teams = load_teams()

    if team_a_code not in teams or team_b_code not in teams:
        return None

    team_a = teams[team_a_code]
    team_b = teams[team_b_code]

    if model == 'historic':
        # 仅历史分
        score_a = calculate_history_score(team_a)
        score_b = calculate_history_score(team_b)
        total_a = score_a
        total_b = score_b
    else:
        # 综合预测
        hist_a = calculate_history_score(team_a)
        hist_b = calculate_history_score(team_b)
        player_a = calculate_player_score(team_a)
        player_b = calculate_player_score(team_b)

        # 综合: 历史40% + 球员60%
        total_a = hist_a * 0.4 + player_a * 0.6
        total_b = hist_b * 0.4 + player_b * 0.6

    # 计算胜率 (logistic函数)
    power_diff = total_a - total_b
    home_win_prob = 1 / (1 + 10 ** (-power_diff / 3))
    away_win_prob = 1 / (1 + 10 ** (power_diff / 3))

    # 归一化，确保和为1
    total_prob = home_win_prob + away_win_prob + 0.15  # 假设15%平局
    home_win_prob = home_win_prob / total_prob
    away_win_prob = away_win_prob / total_prob
    draw_prob = 0.15 / total_prob

    # 预测依据
    factors = []
    if total_a > total_b:
        diff = total_a - total_b
        if diff > 5:
            factors.append(f"{team_a_code}综合实力明显占优")
        else:
            factors.append(f"{team_a_code}综合实力略占优势")
    else:
        diff = total_b - total_a
        if diff > 5:
            factors.append(f"{team_b_code}综合实力明显占优")
        else:
            factors.append(f"{team_b_code}综合实力略占优势")

    return {
        "model": model,
        "win_probability": {
            team_a_code: round(home_win_prob * 100, 1),
            team_b_code: round(away_win_prob * 100, 1),
            "draw": round(draw_prob * 100, 1)
        },
        "strength_rating": {
            team_a_code: round(total_a, 1),
            team_b_code: round(total_b, 1)
        },
        "factors": factors
    }

def get_strength_scores(team_code):
    """获取球队各项评分"""
    teams = load_teams()
    if team_code not in teams:
        return None

    team = teams[team_code]
    hist = calculate_history_score(team)
    player = calculate_player_score(team)

    return {
        "historic": round(hist, 1),
        "player": round(player, 1),
        "total": round(hist * 0.4 + player * 0.6, 1)
    }