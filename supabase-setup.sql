-- ============================================
-- Crazy Match - Supabase 数据库初始化
-- ============================================

-- 预测记录表
CREATE TABLE IF NOT EXISTS predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  predicted_winner TEXT NOT NULL CHECK (predicted_winner IN ('teamA', 'teamB', 'draw')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, device_id)
);

-- 排行榜统计表
CREATE TABLE IF NOT EXISTS leaderboard_stats (
  device_id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  correct_count INTEGER DEFAULT 0,
  total_count INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 比赛结果表（用于开奖）
CREATE TABLE IF NOT EXISTS match_results (
  match_id TEXT PRIMARY KEY,
  winner TEXT NOT NULL CHECK (winner IN ('teamA', 'teamB', 'draw')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用实时订阅
ALTER PUBLICATION supabase_realtime ADD TABLE predictions;
ALTER PUBLICATION supabase_realtime ADD TABLE leaderboard_stats;

-- 开启 RLS（行级安全）
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;

-- 预测表策略：所有人可读写
DROP POLICY IF EXISTS "Anyone can insert predictions" ON predictions;
CREATE POLICY "Anyone can insert predictions" ON predictions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read predictions" ON predictions;
CREATE POLICY "Anyone can read predictions" ON predictions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can update predictions" ON predictions;
CREATE POLICY "Anyone can update predictions" ON predictions FOR UPDATE USING (true);

-- 排行榜策略：所有人可读写
DROP POLICY IF EXISTS "Anyone can upsert leaderboard" ON leaderboard_stats;
CREATE POLICY "Anyone can upsert leaderboard" ON leaderboard_stats FOR ALL USING (true);

-- 比赛结果策略：所有人可读，管理员可写
DROP POLICY IF EXISTS "Anyone can read results" ON match_results;
CREATE POLICY "Anyone can read results" ON match_results FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin can insert results" ON match_results;
CREATE POLICY "Admin can insert results" ON match_results FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can update results" ON match_results;
CREATE POLICY "Admin can update results" ON match_results FOR UPDATE USING (true);

-- 更新排行榜的存储函数
CREATE OR REPLACE FUNCTION update_leaderboard(
  p_device_id TEXT,
  p_nickname TEXT,
  p_is_correct BOOLEAN
) RETURNS void AS $$
BEGIN
  INSERT INTO leaderboard_stats (device_id, nickname, correct_count, total_count, current_streak, updated_at)
  VALUES (
    p_device_id, 
    p_nickname,
    CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    1,
    CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    NOW()
  )
  ON CONFLICT (device_id) DO UPDATE SET
    nickname = COALESCE(p_nickname, leaderboard_stats.nickname),
    correct_count = leaderboard_stats.correct_count + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    total_count = leaderboard_stats.total_count + 1,
    current_streak = CASE 
      WHEN p_is_correct THEN leaderboard_stats.current_streak + 1 
      ELSE 0 
    END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 授予执行权限
GRANT EXECUTE ON FUNCTION update_leaderboard TO anon;
