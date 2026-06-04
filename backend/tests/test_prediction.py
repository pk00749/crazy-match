import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from services.prediction import calculate_history_score, calculate_player_score, calculate_prediction


class TestCalculateHistoryScore:
    def test_brazil_history_score(self):
        """巴西应该有较高的历史分（5次冠军）"""
        team_data = {
            'historic_record': {
                'championships': 5,
                'participations': 22,
                'wins': 73,
                'draws': 18,
                'losses': 17,
                'recent_performance': ['Champion', 'Quarter-final', 'Semi-final']
            }
        }
        score = calculate_history_score(team_data)
        assert score >= 35, f"巴西历史分应该较高，实际: {score}"

    def test_argentina_history_score(self):
        """阿根廷应该有较高历史分（3次冠军）"""
        team_data = {
            'historic_record': {
                'championships': 3,
                'participations': 18,
                'wins': 45,
                'draws': 15,
                'losses': 21,
                'recent_performance': ['Champion', 'Final', 'Semi-final']
            }
        }
        score = calculate_history_score(team_data)
        assert score >= 30, f"阿根廷历史分应该较高，实际: {score}"

    def test_germany_history_score(self):
        """德国应该有较高历史分（4次冠军）"""
        team_data = {
            'historic_record': {
                'championships': 4,
                'participations': 20,
                'wins': 67,
                'draws': 20,
                'losses': 23,
                'recent_performance': ['Group', 'Group', 'Group']
            }
        }
        score = calculate_history_score(team_data)
        assert score >= 25, f"德国历史分应该较高，实际: {score}"

    def test_newcomer_history_score(self):
        """新军历史分应该较低"""
        team_data = {
            'historic_record': {
                'championships': 0,
                'participations': 2,
                'wins': 2,
                'draws': 1,
                'losses': 3,
                'recent_performance': ['Group', 'Group']
            }
        }
        score = calculate_history_score(team_data)
        assert score < 20, f"新军历史分应该较低，实际: {score}"

    def test_empty_history(self):
        """空数据应该返回0"""
        team_data = {}
        score = calculate_history_score(team_data)
        assert score == 0

    def test_max_score_capped(self):
        """历史分最高40分"""
        team_data = {
            'historic_record': {
                'championships': 20,
                'participations': 30,
                'wins': 100,
                'draws': 20,
                'losses': 10,
                'recent_performance': ['Champion', 'Champion', 'Champion']
            }
        }
        score = calculate_history_score(team_data)
        assert score <= 40, f"历史分不应超过40分，实际: {score}"


class TestCalculatePlayerScore:
    def test_top_ranked_team(self):
        """FIFA排名靠前的球队应该有较高球员分"""
        team_data = {
            'fifa_rank': 1,
            'current_squad': [
                {'rating': 90, 'market_value': 10000},
                {'rating': 88, 'market_value': 8000},
                {'rating': 87, 'market_value': 7000},
            ] * 8
        }
        score = calculate_player_score(team_data)
        assert score >= 40, f"强队球员分应该较高，实际: {score}"

    def test_low_ranked_team(self):
        """FIFA排名靠后的球队球员分应该较低"""
        team_data = {
            'fifa_rank': 100,
            'current_squad': [
                {'rating': 70, 'market_value': 500},
                {'rating': 68, 'market_value': 400},
                {'rating': 65, 'market_value': 300},
            ] * 8
        }
        score = calculate_player_score(team_data)
        assert score < 30, f"弱队球员分应该较低，实际: {score}"

    def test_empty_squad(self):
        """空阵容应该返回0"""
        team_data = {'fifa_rank': 50, 'current_squad': []}
        score = calculate_player_score(team_data)
        assert score < 20

    def test_max_score_capped(self):
        """球员分最高60分"""
        team_data = {
            'fifa_rank': 1,
            'current_squad': [{'rating': 100, 'market_value': 50000}] * 23
        }
        score = calculate_player_score(team_data)
        assert score <= 60, f"球员分不应超过60分，实际: {score}"


class TestCalculatePrediction:
    def test_brazil_vs_argentina(self):
        """巴西vs阿根廷预测应该产生合理结果"""
        brazil = {
            'historic_record': {
                'championships': 5, 'participations': 22, 'wins': 73,
                'draws': 18, 'losses': 17, 'recent_performance': ['Champion', 'Quarter-final', 'Semi-final']
            },
            'fifa_rank': 3,
            'current_squad': [{'rating': 88, 'market_value': 5000}] * 23
        }
        argentina = {
            'historic_record': {
                'championships': 3, 'participations': 18, 'wins': 45,
                'draws': 15, 'losses': 21, 'recent_performance': ['Champion', 'Final', 'Semi-final']
            },
            'fifa_rank': 1,
            'current_squad': [{'rating': 86, 'market_value': 4500}] * 23
        }

        result = calculate_prediction(brazil, argentina)

        assert 'win_probability' in result
        assert 'strength_rating' in result
        assert 'factors' in result
        assert result['model'] == 'combined'

        total_prob = (result['win_probability']['team_a'] +
                     result['win_probability']['team_b'] +
                     result['win_probability']['draw'])
        assert 98 <= total_prob <= 102, f"概率总和应该约100%，实际: {total_prob}"

    def test_strong_vs_weak(self):
        """强队vs弱队，强队胜率应该更高"""
        strong_team = {
            'historic_record': {
                'championships': 5, 'participations': 22, 'wins': 73,
                'draws': 18, 'losses': 17, 'recent_performance': ['Champion', 'Final', 'Final']
            },
            'fifa_rank': 1,
            'current_squad': [{'rating': 90, 'market_value': 10000}] * 23
        }
        weak_team = {
            'historic_record': {
                'championships': 0, 'participations': 2, 'wins': 1,
                'draws': 1, 'losses': 5, 'recent_performance': ['Group', 'Group']
            },
            'fifa_rank': 80,
            'current_squad': [{'rating': 65, 'market_value': 200}] * 23
        }

        result = calculate_prediction(strong_team, weak_team)

        assert result['win_probability']['team_a'] > result['win_probability']['team_b']

    def test_equal_teams(self):
        """两支实力相当的队伍，胜率应该接近"""
        team = {
            'historic_record': {
                'championships': 2, 'participations': 15, 'wins': 30,
                'draws': 10, 'losses': 15, 'recent_performance': ['Quarter-final', 'Quarter-final', 'Quarter-final']
            },
            'fifa_rank': 10,
            'current_squad': [{'rating': 80, 'market_value': 3000}] * 23
        }

        result = calculate_prediction(team, team)

        assert result['win_probability']['team_a'] == result['win_probability']['team_b']
        assert result['strength_rating']['team_a'] == result['strength_rating']['team_b']


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
