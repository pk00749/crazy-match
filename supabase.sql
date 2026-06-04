-- =====================================================
-- Crazy Match - Supabase 数据库初始化脚本
-- 执行时间：2026-06-03
-- =====================================================

-- 1. 创建 predictions 表
CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id VARCHAR(50) NOT NULL,
    device_id VARCHAR(100) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    predicted_winner VARCHAR(10) NOT NULL CHECK (predicted_winner IN ('teamA', 'teamB', 'draw')),
    created_at TIMESTAMP DEFAULT NOW(),
    is_correct BOOLEAN
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_predictions_device_id ON predictions(device_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match_id ON predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);

-- 3. 创建排行榜 RPC 函数
CREATE OR REPLACE FUNCTION get_leaderboard()
RETURNS TABLE (
    nickname TEXT,
    correct_count BIGINT,
    total_count BIGINT,
    current_streak BIGINT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.nickname,
        COUNT(*) FILTER (WHERE p.is_correct = true) as correct_count,
        COUNT(*) as total_count,
        0 as current_streak
    FROM predictions p
    GROUP BY p.nickname, p.device_id
    ORDER BY correct_count DESC, total_count ASC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 启用 RLS
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- 5. 创建 RLS 策略
DROP POLICY IF EXISTS "Allow insert predictions" ON predictions;
CREATE POLICY "Allow insert predictions"
ON predictions
FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read predictions" ON predictions;
CREATE POLICY "Allow read predictions"
ON predictions
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow update predictions" ON predictions;
CREATE POLICY "Allow update predictions"
ON predictions
FOR UPDATE
USING (true)
WITH CHECK (true);

-- =====================================================
-- 验证查询
-- =====================================================
-- SELECT * FROM get_leaderboard();
-- SELECT * FROM predictions LIMIT 5;
