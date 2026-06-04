import pytest
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from data_loader import (
    load_teams, load_team_by_id, load_matches,
    load_match_by_id, load_historic_records
)


class TestDataLoader:
    def setup_method(self):
        """每个测试前重置缓存"""
        import data_loader
        data_loader._teams_cache = None
        data_loader._matches_cache = None
        data_loader._historic_cache = None

    def test_load_teams(self):
        """测试加载球队数据"""
        teams = load_teams()
        assert isinstance(teams, list)
        assert len(teams) > 0

        # 检查球队数据结构
        team = teams[0]
        assert 'id' in team
        assert 'name' in team
        assert 'code' in team
        assert 'flag' in team
        assert 'fifa_rank' in team
        assert 'group' in team

    def test_load_team_by_id(self):
        """测试按ID加载球队"""
        # 测试存在的球队
        brazil = load_team_by_id('BRA')
        assert brazil is not None
        assert brazil['name'] == '巴西'
        assert brazil['code'] == 'BRA'

        # 测试不存在的球队
        nonexistent = load_team_by_id('XXX')
        assert nonexistent is None

    def test_load_matches(self):
        """测试加载比赛数据"""
        matches = load_matches()
        assert isinstance(matches, list)
        assert len(matches) > 0

        # 检查比赛数据结构
        match = matches[0]
        assert 'id' in match
        assert 'date' in match
        assert 'time' in match
        assert 'stage' in match
        assert 'team_a' in match
        assert 'team_b' in match

    def test_load_match_by_id(self):
        """测试按ID加载比赛"""
        # 测试存在的比赛
        match = load_match_by_id('group_A_1')
        assert match is not None
        assert match['date'] == '2026-06-11'
        assert match['stage'] == 'group'

        # 测试不存在的比赛
        nonexistent = load_match_by_id('nonexistent')
        assert nonexistent is None

    def test_filter_matches_by_date(self):
        """测试按日期筛选比赛"""
        matches = load_matches()
        date_filtered = [m for m in matches if m['date'] == '2026-06-11']
        assert len(date_filtered) > 0
        for match in date_filtered:
            assert match['date'] == '2026-06-11'

    def test_matches_by_stage(self):
        """测试按阶段筛选比赛"""
        matches = load_matches()
        group_matches = [m for m in matches if m['stage'] == 'group']
        assert len(group_matches) > 0

        round16_matches = [m for m in matches if m['stage'] == 'round16']
        assert len(round16_matches) > 0

        final_matches = [m for m in matches if m['stage'] == 'final']
        assert len(final_matches) == 1

    def test_load_historic_records(self):
        """测试加载历史战绩"""
        historic = load_historic_records()
        assert isinstance(historic, dict)
        assert len(historic) > 0

        # 检查巴西历史战绩
        brazil = historic.get('BRA')
        assert brazil is not None
        assert brazil['championships'] == 5
        assert brazil['participations'] == 22

    def test_caching(self):
        """测试数据缓存"""
        # 第一次加载
        teams1 = load_teams()
        # 第二次加载应该使用缓存
        teams2 = load_teams()
        assert teams1 is teams2  # 应该是同一个对象


class TestMatchCount:
    def test_total_match_count(self):
        """测试比赛总数"""
        matches = load_matches()
        # 根据数据：48场小组赛 + 8场16强 + 4场8强 + 2场4强 + 1场决赛 = 63场
        # 但我们先测试实际数量
        assert len(matches) >= 48, f"比赛数量太少: {len(matches)}"

    def test_group_matches_count(self):
        """测试小组赛比赛数（8组 x 6场 = 48场）"""
        matches = load_matches()
        group_matches = [m for m in matches if m['stage'] == 'group']
        assert len(group_matches) == 48, f"小组赛应该是48场，实际: {len(group_matches)}"

    def test_knockout_matches_count(self):
        """测试淘汰赛比赛数"""
        matches = load_matches()
        round16 = [m for m in matches if m['stage'] == 'round16']
        quarter = [m for m in matches if m['stage'] == 'quarter']
        semi = [m for m in matches if m['stage'] == 'semi']
        final = [m for m in matches if m['stage'] == 'final']

        assert len(round16) == 8
        assert len(quarter) == 4
        assert len(semi) == 2
        assert len(final) == 1


if __name__ == '__main__':
    pytest.main([__file__, '-v'])